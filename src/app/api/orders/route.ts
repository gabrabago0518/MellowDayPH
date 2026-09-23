import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { verifyCustomer } from "@/lib/customer-auth";
import { logError } from "@/lib/error-log";
import { computeOrderPricing, type OrderPricingInput } from "@/lib/order-pricing";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type CashOrderInput = OrderPricingInput & { changeFor?: unknown };

// Cash orders (pickup or delivery) — no PayMongo involved, so the order is
// placed immediately. Price is still recomputed server-side from real menu
// data, exactly like the GCash route, so a client can't fabricate a total.
export async function POST(request: Request) {
  try {
    return await handleCashOrder(request);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await logError({
      source: "server",
      route: "/api/orders",
      message,
      stack: err instanceof Error ? err.stack : undefined,
    });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}

async function handleCashOrder(request: Request) {
  const auth = await verifyCustomer(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: CashOrderInput;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const pricing = await computeOrderPricing(body);
  if ("error" in pricing) {
    return NextResponse.json({ error: pricing.error }, { status: pricing.status });
  }

  let changeFor: number | null = null;
  if (body.changeFor !== undefined && body.changeFor !== null) {
    const value = Number(body.changeFor);
    if (!Number.isFinite(value) || value < pricing.totalPesos) {
      return NextResponse.json(
        { error: `Change amount must be at least the order total (₱${pricing.totalPesos}).` },
        { status: 400 },
      );
    }
    changeFor = value;
  }

  const now = new Date().toISOString();
  const { data: order, error } = await getSupabaseAdmin()
    .from("orders")
    .insert({
      id: `cash-${randomUUID()}`,
      user_id: auth.userId,
      method: "cash",
      status: "placed",
      stage: "confirmation",
      stage_history: { confirmation: now },
      items: pricing.items,
      total: pricing.totalPesos,
      fulfillment: pricing.method,
      delivery_address: pricing.deliveryAddress ?? null,
      change_for: changeFor,
      special_instructions: pricing.specialInstructions ?? null,
      name: pricing.name,
      phone: pricing.phone,
    })
    .select()
    .single();

  if (error) {
    await logError({ source: "server", route: "/api/orders", message: error.message });
    return NextResponse.json({ error: "Could not place your order. Please try again." }, { status: 502 });
  }

  return NextResponse.json({ order }, { status: 201 });
}
