"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/components/ConfirmDialog";
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
  const w = window.open("", "_blank", "width=380,height=680");
  if (!w) return;

  const itemsHtml = order.items
    .map(
      (item) => `
        <div class="item-row">
          <span class="item-qty">${item.quantity}&times;</span>
          <span class="item-name">${escapeHtml(item.name)}</span>
          <span class="item-amount">${formatPrice(item.price * item.quantity)}</span>
        </div>`,
    )
    .join("");

  const deliveryHtml =
    order.fulfillment === "delivery" && order.delivery_address
      ? `
        <p class="label" style="margin-top:8px;">Deliver to</p>
        <p class="note">${escapeHtml(order.delivery_address)}</p>`
      : "";

  const noteHtml = order.special_instructions
    ? `
        <p class="label" style="margin-top:8px;">Note</p>
        <p class="note" style="font-weight:700;">${escapeHtml(order.special_instructions)}</p>`
    : "";

  const cashHtml =
    order.method === "cash" && order.change_for != null
      ? `
        <div class="row"><span class="label">Tendered</span><span>${formatPrice(order.change_for)}</span></div>
        <div class="row" style="font-weight:700;"><span class="label">Change</span><span>${formatPrice(order.change_for - order.total)}</span></div>`
      : "";

  // window.print() runs from the popup's own onload instead of being
  // called synchronously right after document.close() — the logo image
  // below needs a moment to actually load first, or it can print blank.
  w.document.write(`
    <html>
      <head>
        <title>Receipt — ${order.id}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            font-family: "Courier New", Courier, monospace;
            width: 300px;
            margin: 0 auto;
            padding: 22px 18px 26px;
            color: #1a1208;
            font-size: 12.5px;
            line-height: 1.55;
          }
          .center { text-align: center; }
          .logo { display: block; margin: 0 auto 8px; height: 44px; width: 44px; border-radius: 50%; object-fit: cover; }
          .brand { font-size: 17px; font-weight: 700; letter-spacing: 0.5px; margin: 0; }
          .tagline { font-size: 10.5px; color: #6b5c47; margin: 2px 0 0; }
          .meta { font-size: 10.5px; color: #6b5c47; margin: 1px 0; }
          .divider { border: none; border-top: 1px dashed #b8ab94; margin: 12px 0; }
          .divider-solid { border: none; border-top: 2px solid #1a1208; margin: 12px 0; }
          .heading { text-align: center; font-weight: 700; letter-spacing: 1px; margin: 0 0 10px; font-size: 12px; }
          .row { display: flex; justify-content: space-between; gap: 10px; margin: 2px 0; }
          .label { color: #6b5c47; }
          .section-title { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.6px; color: #6b5c47; margin: 0 0 6px; }
          .item-row { display: grid; grid-template-columns: 24px 1fr auto; gap: 6px; margin: 5px 0; }
          .item-amount { text-align: right; }
          .note { margin: 2px 0 0; font-size: 11.5px; }
          .total-row { display: flex; justify-content: space-between; font-weight: 700; font-size: 15px; margin: 4px 0; }
          .footer { margin-top: 16px; text-align: center; }
          .thanks { font-weight: 700; font-size: 13px; margin: 0 0 3px; }
          .small { font-size: 10px; color: #8a7c66; margin: 1px 0; }
        </style>
      </head>
      <body>
        <div class="center">
          <img class="logo" src="${window.location.origin}/logo.png" alt="" />
          <p class="brand">MELLOW DAY PH</p>
          <p class="tagline">A mellow day, every day.</p>
          <p class="meta">Corner Saint Mary, Central Signal Village, Taguig City</p>
          <p class="meta">+63 976 393 3039</p>
        </div>

        <hr class="divider-solid" />

        <p class="heading">ORDER RECEIPT</p>
        <div class="row"><span class="label">Order #</span><span>${order.id}</span></div>
        <div class="row"><span class="label">Date</span><span>${formatDate(order.created_at)}</span></div>
        <div class="row"><span class="label">Customer</span><span>${escapeHtml(order.name)}</span></div>
        <div class="row"><span class="label">Mobile</span><span>${escapeHtml(order.phone)}</span></div>
        <div class="row"><span class="label">Type</span><span>${order.fulfillment === "delivery" ? "Delivery" : "Pickup"}</span></div>
        ${deliveryHtml}

        <hr class="divider" />

        <p class="section-title">Items</p>
        ${itemsHtml}

        <hr class="divider" />

        <div class="total-row"><span>TOTAL</span><span>${formatPrice(order.total)}</span></div>

        <hr class="divider" />

        <div class="row"><span class="label">Payment</span><span>${order.method === "gcash" ? "GCash" : "Cash"}</span></div>
        ${cashHtml}
        ${noteHtml}

        <div class="footer">
          <p class="thanks">Thank you for choosing Mellow Day PH! 🍵</p>
          <p class="small">facebook.com/mellowday.ph &middot; @mellowday.ph</p>
          <p class="small">This receipt is for your reference.</p>
        </div>

        <script>
          window.onload = function () {
            window.focus();
            window.print();
          };
        </script>
      </body>
    </html>
  `);
  w.document.close();
}

export default function CashierPage() {
  const router = useRouter();
  const [state, setState] = useState<GateState>("loading");
  const [username, setUsername] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [orders, setOrders] = useState<AdminOrderRow[] | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<OrderStage | "all">("all");
  const { confirm, ConfirmDialog } = useConfirm();

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
    if (!(await confirm("Log out of the cashier dashboard?"))) return;
    await cashierFetch("/api/cashier/auth/logout", { method: "POST" });
    router.replace("/cashier/login");
  };

  const handleAdvance = async (order: AdminOrderRow) => {
    const effectiveStage = getEffectiveStage(order.stage, order.method);
    const next = getNextStage(effectiveStage, order.method);
    if (!next) return;

    const confirmed = await confirm(
      `Advance order #${order.id} to "${cashierStageLabel(order.fulfillment, next)}"?`,
    );
    if (!confirmed) return;

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
      {ConfirmDialog}
    </div>
  );
}
