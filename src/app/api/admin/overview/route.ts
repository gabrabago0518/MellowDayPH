import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const supabaseAdmin = getSupabaseAdmin();

  const { data: orders, error: ordersError } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 });
  }

  // auth.admin.listUsers() is paginated — loop until a short page tells us
  // we've reached the end, so the account count/list stays accurate no
  // matter how many customers have signed up.
  const accounts: { id: string; email: string | undefined; fullName: string; createdAt: string }[] = [];
  const perPage = 1000;
  for (let page = 1; ; page++) {
    const { data: pageData, error: usersError } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage,
    });
    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }
    for (const u of pageData.users) {
      accounts.push({
        id: u.id,
        email: u.email,
        fullName: (u.user_metadata?.full_name as string) ?? "",
        createdAt: u.created_at,
      });
    }
    if (pageData.users.length < perPage) break;
  }
  accounts.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  const statusCounts = { pending: 0, paid: 0, placed: 0, failed: 0 };
  let revenue = 0;
  for (const order of orders ?? []) {
    if (order.status in statusCounts) {
      statusCounts[order.status as keyof typeof statusCounts]++;
    }
    if (order.status === "paid" || order.status === "placed") {
      revenue += Number(order.total);
    }
  }

  return NextResponse.json({
    orders,
    accounts,
    stats: {
      totalOrders: orders?.length ?? 0,
      totalAccounts: accounts.length,
      revenue,
      statusCounts,
    },
  });
}
