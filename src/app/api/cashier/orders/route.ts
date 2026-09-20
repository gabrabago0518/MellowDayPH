import { NextResponse } from "next/server";
import { verifyCashier } from "@/lib/cashier-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const auth = await verifyCashier(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  // Only orders that were actually confirmed (paid, or cash accepted) are
  // the cashier's job to fulfill — a pending/failed GCash attempt never
  // became a real order.
  const { data: orders, error } = await getSupabaseAdmin()
    .from("orders")
    .select("*")
    .in("status", ["paid", "placed"])
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ orders });
}
