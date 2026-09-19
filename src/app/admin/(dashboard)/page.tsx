"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/adminApi";
import { formatPrice } from "@/lib/menu-data";
import { formatDate, STATUS_LABEL, STATUS_STYLE } from "@/lib/admin-format";
import type { AdminOverview } from "@/lib/admin-types";

export default function AdminOverviewPage() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await adminFetch("/api/admin/overview");
      if (cancelled) return;
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Couldn't load the dashboard.");
        return;
      }
      setData(await res.json());
    }
    load().catch(() => {
      if (!cancelled) setError("Couldn't load the dashboard.");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown-900 sm:text-4xl">
        Dashboard
      </h1>
      <p className="mt-2 text-sm text-brown-900/70">
        A snapshot of orders and accounts across Mellow Day PH.
      </p>

      {error && (
        <div className="mt-10 rounded-3xl bg-white/70 p-8 text-center shadow-sm">
          <p className="text-sm text-brown-900/70">{error}</p>
        </div>
      )}

      {!data && !error && <p className="mt-10 text-sm text-brown-900/60">Loading…</p>}

      {data && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="rounded-3xl bg-white/70 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                Total Orders
              </p>
              <p className="mt-1 font-heading text-2xl font-bold text-brown-900">
                {data.stats.totalOrders}
              </p>
            </div>
            <div className="rounded-3xl bg-white/70 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                Accounts Created
              </p>
              <p className="mt-1 font-heading text-2xl font-bold text-brown-900">
                {data.stats.totalAccounts}
              </p>
            </div>
            <div className="rounded-3xl bg-white/70 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                Confirmed Revenue
              </p>
              <p className="mt-1 font-heading text-2xl font-bold text-brown-900">
                {formatPrice(data.stats.revenue)}
              </p>
            </div>
            <div className="rounded-3xl bg-white/70 p-5 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                Pending / Failed
              </p>
              <p className="mt-1 font-heading text-2xl font-bold text-brown-900">
                {data.stats.statusCounts.pending} / {data.stats.statusCounts.failed}
              </p>
            </div>
          </div>

          <section className="mt-10">
            <h2 className="font-heading text-xl font-bold text-brown-900">Today vs. This Month</h2>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-3xl bg-white/70 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                  Orders Today (DTD)
                </p>
                <p className="mt-1 font-heading text-2xl font-bold text-brown-900">
                  {data.stats.dtd.orders}
                </p>
              </div>
              <div className="rounded-3xl bg-white/70 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                  Revenue Today (DTD)
                </p>
                <p className="mt-1 font-heading text-2xl font-bold text-brown-900">
                  {formatPrice(data.stats.dtd.revenue)}
                </p>
              </div>
              <div className="rounded-3xl bg-white/70 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                  Orders This Month (MTD)
                </p>
                <p className="mt-1 font-heading text-2xl font-bold text-brown-900">
                  {data.stats.mtd.orders}
                </p>
              </div>
              <div className="rounded-3xl bg-white/70 p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                  Revenue This Month (MTD)
                </p>
                <p className="mt-1 font-heading text-2xl font-bold text-brown-900">
                  {formatPrice(data.stats.mtd.revenue)}
                </p>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-heading text-xl font-bold text-brown-900">Best Seller</h2>
            <div className="mt-4 rounded-3xl bg-white/70 p-5 shadow-sm">
              {data.stats.mostSoldProduct ? (
                <>
                  <p className="font-heading text-xl font-bold text-brown-900">
                    {data.stats.mostSoldProduct.name}
                  </p>
                  <p className="mt-1 text-sm text-brown-900/70">
                    {data.stats.mostSoldProduct.quantity} sold (paid &amp; placed orders)
                  </p>
                </>
              ) : (
                <p className="text-sm text-brown-900/60">No confirmed orders yet.</p>
              )}
            </div>
          </section>

          <section className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-xl font-bold text-brown-900">Recent Orders</h2>
              <Link
                href="/admin/orders"
                className="text-sm font-semibold text-brown-900 hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="mt-4 overflow-x-auto rounded-3xl bg-white/70 shadow-sm">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-brown-900/10 text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Customer</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.slice(0, 8).map((order) => (
                    <tr key={order.id} className="border-b border-brown-900/5 last:border-0">
                      <td className="px-4 py-3 text-brown-900/70">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-brown-900">{order.name}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[order.status]}`}
                        >
                          {STATUS_LABEL[order.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-brown-900">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))}
                  {data.orders.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-brown-900/60">
                        No orders yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
