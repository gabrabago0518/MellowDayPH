"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { cashierFetch } from "@/lib/cashierApi";
import { formatDate } from "@/lib/admin-format";
import { formatPrice } from "@/lib/menu-data";
import { getEffectiveStage, getNextStage, getStageLabel } from "@/lib/order-stage";
import type { AdminOrderRow } from "@/lib/admin-types";
import type { OrderStage } from "@/lib/orders";

const STAGE_FILTER_OPTIONS: { value: OrderStage | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "confirmation", label: "Waiting for Confirmation" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for Delivery / Ready to Pick Up" },
  { value: "delivered", label: "Delivered / Completed" },
];

// Cashier-only relabel of the "Confirmed" stage — customers and admins still
// see "Confirmed" (getStageLabel), but cashiers need to know it's not yet
// acted on.
function cashierStageLabel(fulfillment: "pickup" | "delivery", stage: OrderStage): string {
  if (stage === "confirmation") return "Waiting for Confirmation";
  return getStageLabel(fulfillment, stage);
}

type GateState = "loading" | "unauthenticated" | "not-configured" | "error" | "ready";

// order.name/phone/special_instructions are customer-entered text going into
// document.write — escape before interpolating to avoid script injection in
// the printed window.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function printOrderTicket(order: AdminOrderRow) {
  const w = window.open("", "_blank", "width=380,height=600");
  if (!w) return;

  const itemsHtml = order.items
    .map((item) => `<li>${item.quantity}x ${item.name}</li>`)
    .join("");

  w.document.write(`
    <html>
      <head>
        <title>Kitchen Ticket — ${order.id}</title>
        <style>
          body { font-family: monospace; padding: 16px; font-size: 14px; }
          h1 { font-size: 16px; margin: 0 0 8px; }
          p { margin: 2px 0; }
          ul { margin: 10px 0 0; padding-left: 18px; }
          li { margin: 4px 0; font-size: 15px; font-weight: bold; }
          hr { border: none; border-top: 1px dashed #000; margin: 10px 0; }
        </style>
      </head>
      <body>
        <h1>Mellow Day PH — Kitchen Ticket</h1>
        <p>Order #${order.id}</p>
        <p>${formatDate(order.created_at)}</p>
        <p>${escapeHtml(order.name)} &middot; ${escapeHtml(order.phone)}</p>
        <p>${order.fulfillment === "delivery" ? "Delivery" : "Pickup"}</p>
        ${
          order.method === "cash" && order.change_for != null
            ? `<p><strong>Change for: ${formatPrice(order.change_for)}</strong></p>`
            : ""
        }
        ${
          order.special_instructions
            ? `<p><strong>Note: ${escapeHtml(order.special_instructions)}</strong></p>`
            : ""
        }
        <hr />
        <ul>${itemsHtml}</ul>
      </body>
    </html>
  `);
  w.document.close();
  w.focus();
  w.print();
}

function printReceipt(order: AdminOrderRow) {
  const w = window.open("", "_blank", "width=380,height=600");
  if (!w) return;

  const itemsHtml = order.items
    .map(
      (item) =>
        `<div style="display:flex;justify-content:space-between;"><span>${item.quantity}x ${item.name}</span><span>${formatPrice(item.price * item.quantity)}</span></div>`,
    )
    .join("");

  w.document.write(`
    <html>
      <head>
        <title>Receipt — ${order.id}</title>
        <style>
          body { font-family: monospace; padding: 16px; font-size: 13px; }
          h2 { text-align: center; margin: 0; font-size: 16px; }
          p { margin: 2px 0; text-align: center; }
          hr { border: none; border-top: 1px dashed #000; margin: 10px 0; }
        </style>
      </head>
      <body>
        <h2>Mellow Day PH</h2>
        <p>Official Receipt</p>
        <hr />
        <p style="text-align:left;">Order #${order.id}</p>
        <p style="text-align:left;">${formatDate(order.created_at)}</p>
        <p style="text-align:left;">${escapeHtml(order.name)} &middot; ${escapeHtml(order.phone)}</p>
        <hr />
        ${itemsHtml}
        <hr />
        <div style="display:flex;justify-content:space-between;font-weight:bold;">
          <span>Total</span><span>${formatPrice(order.total)}</span>
        </div>
        <p style="text-align:left;margin-top:6px;">
          Payment: ${order.method === "gcash" ? "GCash" : "Cash"}
        </p>
        ${
          order.method === "cash" && order.change_for != null
            ? `<p style="text-align:left;font-weight:bold;">Change for: ${formatPrice(order.change_for)}</p>`
            : ""
        }
        <p style="margin-top:16px;">Thank you for choosing Mellow Day PH!</p>
      </body>
    </html>
  `);
  w.document.close();
  w.focus();
  w.print();
}

export default function CashierPage() {
  const router = useRouter();
  const [state, setState] = useState<GateState>("loading");
  const [username, setUsername] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [orders, setOrders] = useState<AdminOrderRow[] | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<OrderStage | "all">("all");

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await cashierFetch("/api/cashier/session");
        if (cancelled) return;

        if (res.status === 401) {
          setState("unauthenticated");
          return;
        }
        if (res.status === 503) {
          setState("not-configured");
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setErrorMessage(body.error || "Something went wrong.");
          setState("error");
          return;
        }

        const body = await res.json();
        setUsername(body.username ?? null);
        setState("ready");
      } catch {
        if (!cancelled) {
          setErrorMessage("Couldn't reach the server.");
          setState("error");
        }
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state === "unauthenticated") router.replace("/cashier/login");
  }, [state, router]);

  useEffect(() => {
    if (state !== "ready") return;
    let cancelled = false;
    async function loadOrders() {
      const res = await cashierFetch("/api/cashier/orders");
      if (cancelled) return;
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setOrdersError(body.error || "Couldn't load orders.");
        return;
      }
      const body = await res.json();
      setOrders(body.orders);
    }
    loadOrders();
    return () => {
      cancelled = true;
    };
  }, [state]);

  const handleLogout = async () => {
    await cashierFetch("/api/cashier/auth/logout", { method: "POST" });
    router.replace("/cashier/login");
  };

  const handleAdvance = async (order: AdminOrderRow) => {
    const effectiveStage = getEffectiveStage(order.stage, order.method);
    const next = getNextStage(effectiveStage, order.method);
    if (!next) return;

    const stageHistory = { ...order.stage_history, [next]: new Date().toISOString() };

    setOrders((prev) =>
      prev
        ? prev.map((o) => (o.id === order.id ? { ...o, stage: next, stage_history: stageHistory } : o))
        : prev,
    );

    const res = await cashierFetch(`/api/cashier/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stage: next, stageHistory }),
    });
    if (!res.ok) {
      setOrders((prev) =>
        prev
          ? prev.map((o) =>
              o.id === order.id ? { ...o, stage: order.stage, stage_history: order.stage_history } : o,
            )
          : prev,
      );
    }
  };

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm text-brown-900/60">Loading…</p>
      </div>
    );
  }

  if (state === "unauthenticated") return null;

  if (state === "not-configured") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 text-center shadow-sm">
          <h1 className="font-heading text-xl font-bold text-brown-900">
            Cashier Dashboard Not Configured
          </h1>
          <p className="mt-2 text-sm text-brown-900/70">
            This site&apos;s cashier dashboard hasn&apos;t been set up yet.
          </p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6">
        <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 text-center shadow-sm">
          <h1 className="font-heading text-xl font-bold text-brown-900">Couldn&apos;t Load</h1>
          <p className="mt-2 text-sm text-brown-900/70">{errorMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream text-brown-900">
      <header className="border-b border-brown-900/10 bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Logo className="h-10 w-10" />
            <span className="font-heading text-lg font-bold text-brown-900">
              Mellow Day Cashier
            </span>
          </div>
          <div className="flex items-center gap-4">
            {username && <span className="hidden text-sm text-brown-900/60 sm:inline">{username}</span>}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-brown-900 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-brown-800"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8 md:py-12">
        <h1 className="font-heading text-3xl font-bold text-brown-900 sm:text-4xl">Orders</h1>
        <p className="mt-2 text-sm text-brown-900/70">All confirmed orders to fulfill.</p>

        {ordersError && (
          <div className="mt-10 rounded-3xl bg-white/70 p-8 text-center shadow-sm">
            <p className="text-sm text-brown-900/70">{ordersError}</p>
          </div>
        )}

        {!orders && !ordersError && <p className="mt-10 text-sm text-brown-900/60">Loading…</p>}

        {orders && (() => {
          const filteredOrders = orders.filter(
            (order) =>
              stageFilter === "all" || getEffectiveStage(order.stage, order.method) === stageFilter,
          );

          return (
            <>
              <div className="mt-6">
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value as OrderStage | "all")}
                  className="rounded-full bg-white/70 px-4 py-2 text-sm text-brown-900 outline-none focus:bg-white"
                >
                  {STAGE_FILTER_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-4 flex flex-col gap-4">
                {filteredOrders.map((order) => {
              const effectiveStage = getEffectiveStage(order.stage, order.method);
              const nextStage = getNextStage(effectiveStage, order.method);
              const stageLabel = cashierStageLabel(order.fulfillment, effectiveStage);

              return (
                <div key={order.id} className="rounded-3xl bg-white/70 p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                        {formatDate(order.created_at)}
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-brown-900">
                        {order.name} &middot; {order.phone}
                      </p>
                      <p className="text-xs text-brown-900/60">
                        {order.fulfillment === "delivery" ? "Delivery" : "Pickup"} &middot;{" "}
                        {order.method === "gcash" ? "GCash" : "Cash"}
                      </p>
                    </div>
                    <span className="rounded-full bg-green/40 px-3 py-1 text-xs font-bold text-brown-900">
                      {stageLabel}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-1 border-t border-brown-900/10 pt-4 text-sm text-brown-900">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.quantity}x {item.name}
                      </li>
                    ))}
                  </ul>

                  {order.fulfillment === "delivery" && order.delivery_address && (
                    <p className="mt-3 text-xs text-brown-900/60">
                      Deliver to: {order.delivery_address}
                    </p>
                  )}
                  {order.method === "cash" && order.change_for != null && (
                    <p className="mt-1 text-xs font-bold text-brown-900">
                      Change for: {formatPrice(order.change_for)}
                    </p>
                  )}
                  {order.special_instructions && (
                    <p className="mt-1 text-xs font-bold text-brown-900">
                      Note: {order.special_instructions}
                    </p>
                  )}

                  <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-brown-900/10 pt-4">
                    {nextStage && (
                      <button
                        type="button"
                        onClick={() => handleAdvance(order)}
                        className="rounded-full bg-brown-900 px-4 py-2 text-xs font-bold text-cream hover:bg-brown-800"
                      >
                        Advance to {cashierStageLabel(order.fulfillment, nextStage)}
                      </button>
                    )}
                    {effectiveStage === "preparing" && (
                      <button
                        type="button"
                        onClick={() => printOrderTicket(order)}
                        className="rounded-full bg-brown-100/60 px-4 py-2 text-xs font-bold text-brown-900 hover:bg-brown-100"
                      >
                        Print
                      </button>
                    )}
                    {effectiveStage === "out_for_delivery" && (
                      <button
                        type="button"
                        onClick={() => printReceipt(order)}
                        className="rounded-full bg-brown-100/60 px-4 py-2 text-xs font-bold text-brown-900 hover:bg-brown-100"
                      >
                        Print Receipt
                      </button>
                    )}
                  </div>
                </div>
              );
                })}
                {filteredOrders.length === 0 && (
                  <div className="rounded-3xl bg-white/70 p-10 text-center shadow-sm">
                    <p className="text-sm text-brown-900/60">
                      {orders.length === 0
                        ? "No orders to fulfill right now."
                        : "No orders match this filter."}
                    </p>
                  </div>
                )}
              </div>
            </>
          );
        })()}
      </main>
    </div>
  );
}
