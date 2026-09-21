import { NextResponse } from "next/server";
import { verifyCustomer } from "@/lib/customer-auth";
import { getEffectiveStage, getNextStage } from "@/lib/order-stage";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

// Lets a customer self-declare their own order "Delivered"/"Completed" —
// the one stage transition customers are trusted to report themselves.
// Deliberately narrow: verifies ownership, that the order is a real
// confirmed order, and that "delivered" is genuinely the next stage (never
// an arbitrary stage or a skip), and computes the timestamp itself rather
// than trusting a client-supplied one.
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyCustomer(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;

  const { data: order, error: fetchError } = await getSupabaseAdmin()
    .from("orders")
    .select("id, user_id, status, stage, stage_history, method")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }
  if (order.user_id !== auth.userId) {
    return NextResponse.json({ error: "This isn't your order." }, { status: 403 });
  }
  if (order.status !== "paid" && order.status !== "placed") {
    return NextResponse.json({ error: "This order can't be updated." }, { status: 400 });
  }

  const effectiveStage = getEffectiveStage(order.stage, order.method);
  const nextStage = getNextStage(effectiveStage, order.method);
  if (nextStage !== "delivered") {
    return NextResponse.json(
      { error: "This order isn't ready to be marked delivered yet." },
      { status: 400 },
    );
  }

  const stageHistory = { ...order.stage_history, delivered: new Date().toISOString() };
  const { data: updated, error: updateError } = await getSupabaseAdmin()
    .from("orders")
    .update({ stage: "delivered", stage_history: stageHistory })
    .eq("id", id)
    .select()
    .single();

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ order: updated });
}
