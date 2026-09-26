import { NextResponse } from "next/server";
import { verifyCashier } from "@/lib/cashier-auth";
import { phDateKey } from "@/lib/ph-date";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export type DaySummary = {
  date: string;
  totalOrders: number;
  totalSales: number;
  cashTotal: number;
  gcashTotal: number;
  pendingCount: number;
  pendingAmount: number;
};

// Shared by the GET here and the close-day route below it — recomputes
// today's totals from the orders table itself rather than trusting
// anything the client sends, same principle as order pricing: money
// figures are never taken on faith from the browser.
export async function computeDaySummary(): Promise<DaySummary> {
  const todayKey = phDateKey(new Date());

  const { data: orders, error } = await getSupabaseAdmin()
    .from("orders")
    .select("total, method, status, created_at")
    .gte("created_at", new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString());

  if (error) throw new Error(error.message);

  let totalOrders = 0;
  let totalSales = 0;
  let cashTotal = 0;
  let gcashTotal = 0;
  let pendingCount = 0;
  let pendingAmount = 0;

  for (const order of orders ?? []) {
    if (phDateKey(new Date(order.created_at)) !== todayKey) continue;

    if (order.status === "paid" || order.status === "placed") {
      totalOrders++;
      totalSales += Number(order.total);
      if (order.method === "cash") cashTotal += Number(order.total);
      else gcashTotal += Number(order.total);
    } else if (order.status === "pending") {
      pendingCount++;
      pendingAmount += Number(order.total);
    }
  }

  return { date: todayKey, totalOrders, totalSales, cashTotal, gcashTotal, pendingCount, pendingAmount };
}

export async function GET(request: Request) {
  const auth = await verifyCashier(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const summary = await computeDaySummary();
    return NextResponse.json(summary);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Couldn't load today's summary.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
