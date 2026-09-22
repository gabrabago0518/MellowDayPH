import { NextResponse } from "next/server";
import { getPaymentIntent } from "@/lib/paymongo";
import { getSupabaseAdmin, isAdminConfigured } from "@/lib/supabase-admin";

// getPaymentIntent can retry once internally (see paymongoFetch), each
// attempt with its own timeout — give the route enough room for that.
export const maxDuration = 20;

// Called from /checkout/return once the customer is back from GCash. The
// payment_intent id + client_key pair (PayMongo's own capability token,
// scoped to that one intent) is the authorization here — no customer
// session is required or expected at this exact moment, matching how
// PayMongo's own client-side flow already works. This is also what
// actually persists the result: unlike the old client-side write, a
// customer can no longer mark their own order "paid" without this route
// independently re-verifying the payment against PayMongo first.
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : null;
  const clientKey = typeof body?.clientKey === "string" ? body.clientKey : null;

  if (!id || !clientKey) {
    return NextResponse.json({ error: "Missing payment reference" }, { status: 400 });
  }

  let intent;
  try {
    intent = await getPaymentIntent(id, clientKey);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not check payment status";
    return NextResponse.json({ error: message }, { status: 502 });
  }

  if (isAdminConfigured) {
    if (intent.status === "succeeded") {
      const now = new Date().toISOString();
      // Always the first stage ever recorded for a GCash order — payment
      // success skips "Confirmation" straight into prep — so the history
      // starts fresh rather than needing a merge.
      await getSupabaseAdmin()
        .from("orders")
        .update({ status: "paid", stage: "preparing", stage_history: { preparing: now } })
        .eq("id", id);
    } else if (intent.status !== "awaiting_payment_method" && intent.status !== "processing") {
      await getSupabaseAdmin().from("orders").update({ status: "failed" }).eq("id", id);
    }
  }

  return NextResponse.json(intent);
}
