"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { formatPrice } from "@/lib/menu-data";
import { formatDate, STATUS_LABEL, STATUS_STYLE } from "@/lib/admin-format";
import { getEffectiveStage, getNextStage, getStageLabel } from "@/lib/order-stage";
import type { AdminOrderRow } from "@/lib/admin-types";
import type { OrderStatus } from "@/lib/orders";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await adminFetch("/api/admin/overview");
      if (cancelled) return;
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Couldn't load orders.");
        return;
      }
      const body = await res.json();
      setOrders(body.orders);
    }
    load().catch(() => {
      if (!cancelled) setError("Couldn't load orders.");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAdvance = async (order: AdminOrderRow) => {
    const effectiveStage = getEffectiveStage(order.stage, order.method);
    const next = getNextStage(effectiveStage, order.method);
    if (!next) return;

    setOrders((prev) => (prev ? prev.map((o) => (o.id === order.id ? { ...o, stage: next } : o)) : prev));

    const res = await adminFetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: next }),
    });
    if (!res.ok) {
      // Revert on failure.
      setOrders((prev) =>
        prev ? prev.map((o) => (o.id === order.id ? { ...o, stage: order.stage } : o)) : prev,
      );
    }
  };

  const filteredOrders = (orders ?? []).filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      order.name.toLowerCase().includes(q) ||
      order.phone.includes(q) ||
      order.id.toLowerCase().includes(q)
    );
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown-900 sm:text-4xl">Orders</h1>
      <p className="mt-2 text-sm text-brown-900/70">Every order placed on Mellow Day PH.</p>

      {error && (
        <div className="mt-10 rounded-3xl bg-white/70 p-8 text-center shadow-sm">
          <p className="text-sm text-brown-900/70">{error}</p>
        </div>
      )}

      {!orders && !error && <p className="mt-10 text-sm text-brown-900/60">Loading…</p>}

      {orders && (
        <section className="mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, phone, or order id"
                className="rounded-full bg-white/70 px-4 py-2 text-sm text-brown-900 outline-none focus:bg-white"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as OrderStatus | "all")}
                className="rounded-full bg-white/70 px-4 py-2 text-sm text-brown-900 outline-none focus:bg-white"
              >
                <option value="all">All statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="placed">Placed (Cash)</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto rounded-3xl bg-white/70 shadow-sm">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-brown-900/10 text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Items</th>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">Fulfillment</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Stage</th>
                  <th className="px-4 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const trackable = order.status === "paid" || order.status === "placed";
                  const effectiveStage = trackable
                    ? getEffectiveStage(order.stage, order.method)
                    : null;
                  const nextStage = effectiveStage ? getNextStage(effectiveStage, order.method) : null;

                  return (
                    <tr key={order.id} className="border-b border-brown-900/5 last:border-0">
                      <td className="px-4 py-3 text-brown-900/70">{formatDate(order.created_at)}</td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-brown-900">{order.name}</p>
                        <p className="text-xs text-brown-900/60">{order.phone}</p>
                      </td>
                      <td className="px-4 py-3 text-brown-900/70">
                        {order.items.reduce((sum, i) => sum + i.quantity, 0)} item(s)
                      </td>
                      <td className="px-4 py-3 text-brown-900/70">
                        {order.method === "gcash" ? "GCash" : "Cash"}
                      </td>
                      <td className="px-4 py-3 text-brown-900/70">
                        {order.fulfillment === "delivery" ? "Delivery" : "Pickup"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_STYLE[order.status]}`}
                        >
                          {STATUS_LABEL[order.status]}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-brown-900/70">
                        {effectiveStage ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-brown-900">
                              {getStageLabel(order.fulfillment, effectiveStage)}
                            </span>
                            {nextStage && (
                              <button
                                type="button"
                                onClick={() => handleAdvance(order)}
                                className="rounded-full bg-brown-900 px-2.5 py-1 text-[11px] font-bold text-cream hover:bg-brown-800"
                              >
                                Advance
                              </button>
                            )}
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-brown-900">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  );
                })}
                {filteredOrders.length === 0 && (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-brown-900/60">
                      No orders match.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
