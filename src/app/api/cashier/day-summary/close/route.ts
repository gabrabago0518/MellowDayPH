import { NextResponse } from "next/server";
import { verifyCashier } from "@/lib/cashier-auth";
import { logError } from "@/lib/error-log";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { computeDaySummary } from "../route";

// Records an end-of-day cash count. The expected cash figure is always
// recomputed here from the orders table, never trusted from the request —
// a cashier can only report what they actually counted, not what the
// system thinks the drawer should hold.
export async function POST(request: Request) {
  const auth = await verifyCashier(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json().catch(() => null);
  const cashCounted = Number(body?.cashCounted);
  if (!Number.isFinite(cashCounted) || cashCounted < 0) {
    return NextResponse.json({ error: "Enter the amount of cash actually counted." }, { status: 400 });
  }

  try {
    const summary = await computeDaySummary();
    const cashDifference = cashCounted - summary.cashTotal;

    const { data, error } = await getSupabaseAdmin()
      .from("cash_reconciliations")
      .insert({
        staff_id: auth.staff.id,
        staff_username: auth.staff.username,
        business_date: summary.date,
        total_orders: summary.totalOrders,
        total_sales: summary.totalSales,
        cash_expected: summary.cashTotal,
        gcash_total: summary.gcashTotal,
        cash_counted: cashCounted,
        cash_difference: cashDifference,
      })
      .select()
      .single();

    if (error) {
      await logError({ source: "server", route: "/api/cashier/day-summary/close", message: error.message });
      return NextResponse.json({ error: "Could not save the closing. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ reconciliation: data, summary }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await logError({ source: "server", route: "/api/cashier/day-summary/close", message });
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
