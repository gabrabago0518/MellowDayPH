"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { formatDate } from "@/lib/admin-format";
import type { AdminAccount } from "@/lib/admin-types";

export default function AdminCustomersPage() {
  const [accounts, setAccounts] = useState<AdminAccount[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const res = await adminFetch("/api/admin/overview");
      if (cancelled) return;
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Couldn't load customers.");
        return;
      }
      const body = await res.json();
      setAccounts(body.accounts);
    }
    load().catch(() => {
      if (!cancelled) setError("Couldn't load customers.");
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = (accounts ?? []).filter((account) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (account.email ?? "").toLowerCase().includes(q) || account.fullName.toLowerCase().includes(q);
  });

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown-900 sm:text-4xl">Customers</h1>
      <p className="mt-2 text-sm text-brown-900/70">Every account signed up on Mellow Day PH.</p>

      {error && (
        <div className="mt-10 rounded-3xl bg-white/70 p-8 text-center shadow-sm">
          <p className="text-sm text-brown-900/70">{error}</p>
        </div>
      )}

      {!accounts && !error && <p className="mt-10 text-sm text-brown-900/60">Loading…</p>}

      {accounts && (
        <section className="mt-8">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name or email"
            className="rounded-full bg-white/70 px-4 py-2 text-sm text-brown-900 outline-none focus:bg-white"
          />

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
                {filtered.map((account) => (
                  <tr key={account.id} className="border-b border-brown-900/5 last:border-0">
                    <td className="px-4 py-3 font-semibold text-brown-900">
                      {account.fullName || "—"}
                    </td>
                    <td className="px-4 py-3 text-brown-900/70">{account.email}</td>
                    <td className="px-4 py-3 text-brown-900/70">{formatDate(account.createdAt)}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-brown-900/60">
                      No accounts match.
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
