"use client";

import { useEffect, useState } from "react";
import { useConfirm } from "@/components/ConfirmDialog";
import { cashierFetch } from "@/lib/cashierApi";
import { formatPrice } from "@/lib/menu-data";

type DaySummary = {
  date: string;
  totalOrders: number;
  totalSales: number;
  cashTotal: number;
  gcashTotal: number;
  pendingCount: number;
  pendingAmount: number;
};

type CashReconciliation = {
  id: string;
  cash_counted: number;
  cash_difference: number;
  created_at: string;
};

export default function CashierEndOfDayPage() {
  const [daySummary, setDaySummary] = useState<DaySummary | null>(null);
  const [daySummaryError, setDaySummaryError] = useState<string | null>(null);
  const [cashCounted, setCashCounted] = useState("");
  const [closing, setClosing] = useState(false);
  const [closeError, setCloseError] = useState<string | null>(null);
  const [closeResult, setCloseResult] = useState<CashReconciliation | null>(null);
  const { confirm, ConfirmDialog } = useConfirm();

  useEffect(() => {
    let cancelled = false;
    async function loadDaySummary() {
      setDaySummaryError(null);
      try {
        const res = await cashierFetch("/api/cashier/day-summary");
        if (cancelled) return;
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setDaySummaryError(body.error || "Couldn't load today's summary.");
          return;
        }
        setDaySummary(await res.json());
      } catch {
        if (!cancelled) setDaySummaryError("Couldn't load today's summary.");
      }
    }
    loadDaySummary();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCloseDay = async () => {
    const value = Number(cashCounted);
    if (!Number.isFinite(value) || value < 0) return;
    if (!(await confirm(`Record end of day with ${formatPrice(value)} counted in the drawer?`))) return;

    setClosing(true);
    setCloseError(null);
    const res = await cashierFetch("/api/cashier/day-summary/close", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cashCounted: value }),
    });
    setClosing(false);

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setCloseError(body.error || "Could not save the closing.");
      return;
    }

    const body = await res.json();
    setCloseResult(body.reconciliation);
    setDaySummary(body.summary);
    setCashCounted("");
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown-900 sm:text-4xl">End of Day</h1>
      <p className="mt-2 text-sm text-brown-900/70">
        Today&apos;s totals, and a place to count and record the cash drawer at close.
      </p>

      {daySummaryError && (
        <div className="mt-10 rounded-3xl bg-white/70 p-8 text-center shadow-sm">
          <p className="text-sm text-brown-900/70">{daySummaryError}</p>
        </div>
      )}
      {!daySummary && !daySummaryError && <p className="mt-10 text-sm text-brown-900/60">Loading…</p>}

      {daySummary && (
        <div className="mt-6 rounded-3xl bg-white/70 p-6 shadow-sm">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-2xl bg-green/20 p-3">
              <p className="text-xs text-brown-900/60">Today&apos;s Orders</p>
              <p className="text-lg font-bold text-brown-900">{daySummary.totalOrders}</p>
            </div>
            <div className="rounded-2xl bg-green/20 p-3">
              <p className="text-xs text-brown-900/60">Total Sales</p>
              <p className="text-lg font-bold text-brown-900">{formatPrice(daySummary.totalSales)}</p>
            </div>
            <div className="rounded-2xl bg-brown-100/40 p-3">
              <p className="text-xs text-brown-900/60">Cash</p>
              <p className="text-lg font-bold text-brown-900">{formatPrice(daySummary.cashTotal)}</p>
            </div>
            <div className="rounded-2xl bg-brown-100/40 p-3">
              <p className="text-xs text-brown-900/60">GCash</p>
              <p className="text-lg font-bold text-brown-900">{formatPrice(daySummary.gcashTotal)}</p>
            </div>
          </div>

          {daySummary.pendingCount > 0 && (
            <p className="mt-3 text-xs text-brown-900/60">
              {daySummary.pendingCount} order{daySummary.pendingCount === 1 ? "" : "s"} still awaiting
              GCash payment ({formatPrice(daySummary.pendingAmount)}) — not counted above.
            </p>
          )}

          <div className="mt-5 border-t border-brown-900/10 pt-4">
            <label className="flex max-w-xs flex-col gap-1.5 text-sm">
              <span className="font-semibold text-brown-900/80">Cash counted in drawer</span>
              <input
                type="number"
                min={0}
                step="1"
                value={cashCounted}
                onChange={(e) => setCashCounted(e.target.value)}
                placeholder={`e.g. ${daySummary.cashTotal}`}
                className="rounded-xl bg-brown-100/40 px-3 py-2.5 text-brown-900 outline-none focus:bg-white"
              />
            </label>

            {cashCounted.trim() !== "" && Number.isFinite(Number(cashCounted)) && (() => {
              const diff = Number(cashCounted) - daySummary.cashTotal;
              return (
                <p
                  className={`mt-2 text-sm font-bold ${
                    diff === 0 ? "text-brown-900/70" : diff > 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {diff === 0
                    ? "Matches expected cash exactly."
                    : diff > 0
                      ? `${formatPrice(diff)} over expected`
                      : `${formatPrice(Math.abs(diff))} short of expected`}
                </p>
              );
            })()}

            {closeError && <p className="mt-2 text-sm text-red-700">{closeError}</p>}
            {closeResult && (
              <p className="mt-2 rounded-xl bg-green/20 px-3 py-2 text-sm text-brown-900">
                Recorded at {new Date(closeResult.created_at).toLocaleTimeString("en-PH")} —{" "}
                {closeResult.cash_difference === 0
                  ? "exact match"
                  : closeResult.cash_difference > 0
                    ? `${formatPrice(closeResult.cash_difference)} over`
                    : `${formatPrice(Math.abs(closeResult.cash_difference))} short`}
              </p>
            )}

            <button
              type="button"
              disabled={closing || cashCounted.trim() === ""}
              onClick={handleCloseDay}
              className="mt-3 rounded-full bg-brown-900 px-5 py-2.5 text-sm font-bold text-cream hover:bg-brown-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {closing ? "Saving…" : "Record End of Day"}
            </button>
          </div>
        </div>
      )}
      {ConfirmDialog}
    </div>
  );
}
