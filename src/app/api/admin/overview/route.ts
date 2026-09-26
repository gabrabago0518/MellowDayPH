import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { phDateKey } from "@/lib/ph-date";
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

  const todayKey = phDateKey(new Date());
  const monthKey = todayKey.slice(0, 7);

  const statusCounts = { pending: 0, paid: 0, placed: 0, failed: 0 };
  let revenue = 0;
  let dtdOrders = 0;
  let dtdRevenue = 0;
  let mtdOrders = 0;
  let mtdRevenue = 0;
  const productSales = new Map<string, { name: string; quantity: number }>();

  for (const order of orders ?? []) {
    if (order.status in statusCounts) {
      statusCounts[order.status as keyof typeof statusCounts]++;
    }

    const confirmed = order.status === "paid" || order.status === "placed";
    if (confirmed) revenue += Number(order.total);

    const orderDateKey = phDateKey(new Date(order.created_at));
    const isToday = orderDateKey === todayKey;
    const isThisMonth = orderDateKey.slice(0, 7) === monthKey;

    if (isToday) {
      dtdOrders++;
      if (confirmed) dtdRevenue += Number(order.total);
    }
    if (isThisMonth) {
      mtdOrders++;
      if (confirmed) mtdRevenue += Number(order.total);
    }

    if (confirmed) {
      for (const item of order.items ?? []) {
        const existing = productSales.get(item.id);
        if (existing) {
          existing.quantity += item.quantity;
        } else {
          productSales.set(item.id, { name: item.name, quantity: item.quantity });
        }
      }
    }
  }

  let mostSoldProduct: { name: string; quantity: number } | null = null;
  for (const entry of productSales.values()) {
    if (!mostSoldProduct || entry.quantity > mostSoldProduct.quantity) {
      mostSoldProduct = entry;
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
      dtd: { orders: dtdOrders, revenue: dtdRevenue },
      mtd: { orders: mtdOrders, revenue: mtdRevenue },
      mostSoldProduct,
    },
  });
}
