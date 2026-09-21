import { NextResponse } from "next/server";
import { verifyCustomer } from "@/lib/customer-auth";
import { computeOrderPricing, MIN_AMOUNT_PESOS, type OrderPricingInput } from "@/lib/order-pricing";
import { createGCashCheckout } from "@/lib/paymongo";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
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

  const pricing = computeOrderPricing(body);
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
    return NextResponse.json({ error: "Could not save your order. Please try again." }, { status: 502 });
  }

  return NextResponse.json({
    paymentIntentId: checkout.paymentIntentId,
    clientKey: checkout.clientKey,
    checkoutUrl: checkout.checkoutUrl,
    order,
  });
}
