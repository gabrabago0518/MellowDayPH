import { NextResponse } from "next/server";
import { verifyCustomer } from "@/lib/customer-auth";
import { logError } from "@/lib/error-log";
import { computeOrderPricing, MIN_AMOUNT_PESOS, type OrderPricingInput } from "@/lib/order-pricing";
import { createGCashCheckout } from "@/lib/paymongo";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// This route makes up to 3 sequential PayMongo calls (create intent,
// create payment method, attach), each of which can now retry once with
// its own timeout (see paymongoFetch) — the platform default function
// timeout could otherwise cut off a legitimate retry mid-flight. The
// deployment platform's own plan ceiling still applies on top of this.
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    return await handleCheckout(request);
  } catch (err) {
    // Safety net for anything not already handled below (e.g. the
    // database lookup inside computeOrderPricing throwing on a transient
    // error) — this is the payment path, so an uncaught exception here
    // gets logged and paged, not just a silent 500.
    const message = err instanceof Error ? err.message : "Unknown error";
    await logError({
      source: "server",
      route: "/api/checkout",
      message,
      stack: err instanceof Error ? err.stack : undefined,
    });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

async function handleCheckout(request: Request) {
  const auth = await verifyCustomer(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: OrderPricingInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const pricing = await computeOrderPricing(body);
  if ("error" in pricing) {
    return NextResponse.json({ error: pricing.error }, { status: pricing.status });
  }

  if (pricing.totalPesos < MIN_AMOUNT_PESOS) {
    return NextResponse.json(
      { error: `Minimum order for GCash payment is ₱${MIN_AMOUNT_PESOS}` },
      { status: 400 },
    );
  }

  const origin = new URL(request.url).origin;

  let checkout;
  try {
    checkout = await createGCashCheckout({
      amountCentavos: Math.round(pricing.totalPesos * 100),
      description: `Mellow Day PH order for ${pricing.name}`,
      metadata: {
        order_summary: pricing.orderSummary,
        customer_name: pricing.name,
        customer_phone: pricing.phone,
        fulfillment_method: pricing.method,
        ...(pricing.deliveryAddress ? { delivery_address: pricing.deliveryAddress } : {}),
        ...(pricing.specialInstructions ? { special_instructions: pricing.specialInstructions } : {}),
      },
      billing: { name: pricing.name, phone: pricing.phone, email: pricing.email || undefined },
      returnUrl: `${origin}/checkout/return`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment setup failed";
    await logError({ source: "server", route: "/api/checkout", message, context: { stage: "paymongo" } });
    return NextResponse.json({ error: message }, { status: 502 });
  }

  // The order row is created server-side, tied to the real authenticated
  // user id — never a client-supplied one — with the same server-computed
  // price used for the PayMongo amount above.
  const { data: order, error: insertError } = await getSupabaseAdmin()
    .from("orders")
    .insert({
      id: checkout.paymentIntentId,
      user_id: auth.userId,
      method: "gcash",
      status: "pending",
      items: pricing.items,
      total: pricing.totalPesos,
      fulfillment: pricing.method,
      delivery_address: pricing.deliveryAddress ?? null,
      special_instructions: pricing.specialInstructions ?? null,
      name: pricing.name,
      phone: pricing.phone,
    })
    .select()
    .single();

  if (insertError) {
    await logError({
      source: "server",
      route: "/api/checkout",
      message: insertError.message,
      context: { stage: "order-insert", paymentIntentId: checkout.paymentIntentId },
    });
    return NextResponse.json({ error: "Could not save your order. Please try again." }, { status: 502 });
  }

  return NextResponse.json({
    paymentIntentId: checkout.paymentIntentId,
    clientKey: checkout.clientKey,
    checkoutUrl: checkout.checkoutUrl,
    order,
  });
}
