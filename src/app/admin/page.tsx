"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";
import { formatPrice } from "@/lib/menu-data";
import { supabase } from "@/lib/supabase";
import type { OrderItem, OrderStatus } from "@/lib/orders";

type AdminOrderRow = {
  id: string;
  user_id: string;
  created_at: string;
  method: "gcash" | "cash";
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  fulfillment: "pickup" | "delivery";
  delivery_address: string | null;
  name: string;
  phone: string;
};

type AdminAccount = {
  id: string;
  email: string | undefined;
  fullName: string;
  createdAt: string;
};

type Overview = {
  orders: AdminOrderRow[];
  accounts: AdminAccount[];
  stats: {
    totalOrders: number;
    totalAccounts: number;
    revenue: number;
    statusCounts: Record<OrderStatus, number>;
  };
};

const STATUS_LABEL: Record<OrderStatus, string> = {
  paid: "Paid",
  placed: "Placed (Cash)",
  pending: "Pending",
  failed: "Failed",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  paid: "bg-green/40 text-brown-900",
  placed: "bg-green/40 text-brown-900",
  pending: "bg-gold/30 text-brown-900",
  failed: "bg-red-100 text-red-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

type LoadState =
  | "loading"
  | "unauthenticated"
  | "token-rejected"
  | "unauthorized"
  | "not-configured"
  | "error"
  | "ready";

export default function AdminPage() {
  const router = useRouter();
  const { loading: authLoading } = useAuth();
  const [state, setState] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState<Overview | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  useEffect(() => {
    if (authLoading) return;

    if (!supabase) {
      queueMicrotask(() => setState("unauthenticated"));
      return;
    }

    let cancelled = false;

    async function load() {
      // Read the session directly from the SDK rather than the AuthContext's
      // `user` — right after a fresh login via router.push, that context can
      // briefly still reflect the pre-login state, incorrectly bouncing an
      // already-authenticated visitor back to /login.
      const { data: sessionData } = await supabase!.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        if (!cancelled) setState("unauthenticated");
        return;
      }

      const res = await fetch("/api/admin/overview", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (cancelled) return;

      if (res.status === 401) {
        // We had a token client-side but the server rejected it — this is
        // different from "never logged in" and looping back to /admin/login
        // would just be confusing, so surface it instead.
        const body = await res.json().catch(() => ({}));
        setErrorMessage(body.error || "Session rejected by the server.");
        setState("token-rejected");
        return;
      }
      if (res.status === 403) {
        setState("unauthorized");
        return;
      }
      if (res.status === 503) {
        setState("not-configured");
        return;
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setErrorMessage(body.error || "Something went wrong loading the dashboard.");
        setState("error");
        return;
      }

      const body: Overview = await res.json();
      setData(body);
      setState("ready");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [authLoading]);

  useEffect(() => {
    if (state === "unauthenticated") router.replace("/admin/login");
  }, [state, router]);

  const filteredOrders = (data?.orders ?? []).filter((order) => {
    if (statusFilter !== "all" && order.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return order.name.toLowerCase().includes(q) || order.phone.includes(q) || order.id.toLowerCase().includes(q);
  });

  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown-900">
      <Header />

      <main className="flex-1 px-6 py-28 md:py-32">
        <div className="mx-auto max-w-6xl">
          <h1 className="font-heading text-3xl font-bold text-brown-900 sm:text-4xl">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm text-brown-900/70">
            All orders and accounts across Mellow Day PH.
          </p>

          {(state === "loading" || authLoading) && (
            <p className="mt-10 text-sm text-brown-900/60">Loading…</p>
          )}

          {state === "token-rejected" && (
            <div className="mt-10 rounded-3xl bg-white/70 p-8 text-center shadow-sm">
              <h2 className="font-heading text-xl font-bold text-brown-900">
                Session Not Recognized
              </h2>
              <p className="mt-2 text-sm text-brown-900/70">
                You&apos;re logged in, but the server rejected your session:{" "}
                <strong>{errorMessage}</strong>. This usually means
                SUPABASE_SERVICE_ROLE_KEY belongs to a different Supabase project than
                NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_ANON_KEY.
              </p>
            </div>
          )}

          {state === "unauthorized" && (
            <div className="mt-10 rounded-3xl bg-white/70 p-8 text-center shadow-sm">
              <h2 className="font-heading text-xl font-bold text-brown-900">Access Denied</h2>
              <p className="mt-2 text-sm text-brown-900/70">
                This account isn&apos;t authorized to view the admin dashboard.
              </p>
            </div>
          )}

          {state === "not-configured" && (
            <div className="mt-10 rounded-3xl bg-white/70 p-8 text-center shadow-sm">
              <h2 className="font-heading text-xl font-bold text-brown-900">Not Set Up Yet</h2>
              <p className="mt-2 text-sm text-brown-900/70">
                The admin dashboard needs SUPABASE_SERVICE_ROLE_KEY and ADMIN_EMAILS set on
                the server first.
              </p>
            </div>
          )}

          {state === "error" && (
            <div className="mt-10 rounded-3xl bg-white/70 p-8 text-center shadow-sm">
              <h2 className="font-heading text-xl font-bold text-brown-900">
                Couldn&apos;t Load Dashboard
              </h2>
              <p className="mt-2 text-sm text-brown-900/70">{errorMessage}</p>
            </div>
          )}

          {state === "ready" && data && (
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
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="font-heading text-xl font-bold text-brown-900">Orders</h2>
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
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-brown-900/10 text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                        <th className="px-4 py-3">Date</th>
                        <th className="px-4 py-3">Customer</th>
                        <th className="px-4 py-3">Items</th>
                        <th className="px-4 py-3">Method</th>
                        <th className="px-4 py-3">Fulfillment</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id} className="border-b border-brown-900/5 last:border-0">
                          <td className="px-4 py-3 text-brown-900/70">
                            {formatDate(order.created_at)}
                          </td>
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
                          <td className="px-4 py-3 text-right font-semibold text-brown-900">
                            {formatPrice(order.total)}
                          </td>
                        </tr>
                      ))}
                      {filteredOrders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-brown-900/60">
                            No orders match.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="mt-10">
                <h2 className="font-heading text-xl font-bold text-brown-900">
                  Recent Accounts
                </h2>
                <div className="mt-4 overflow-x-auto rounded-3xl bg-white/70 shadow-sm">
                  <table className="w-full min-w-[480px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-brown-900/10 text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">Joined</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.accounts.slice(0, 20).map((account) => (
                        <tr key={account.id} className="border-b border-brown-900/5 last:border-0">
                          <td className="px-4 py-3 font-semibold text-brown-900">
                            {account.fullName || "—"}
                          </td>
                          <td className="px-4 py-3 text-brown-900/70">{account.email}</td>
                          <td className="px-4 py-3 text-brown-900/70">
                            {formatDate(account.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
