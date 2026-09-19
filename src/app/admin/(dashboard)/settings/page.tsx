"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";

export default function AdminSettingsPage() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    adminFetch("/api/admin/session")
      .then((res) => (res.ok ? res.json() : null))
      .then((body) => setEmail(body?.email ?? null))
      .catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown-900 sm:text-4xl">Settings</h1>
      <p className="mt-2 text-sm text-brown-900/70">Admin account and dashboard configuration.</p>

      <section className="mt-8 rounded-3xl bg-white/70 p-6 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-brown-900">Signed In As</h2>
        <p className="mt-2 text-sm text-brown-900/70">{email ?? "—"}</p>
      </section>

      <section className="mt-6 rounded-3xl bg-white/70 p-6 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-brown-900">Admin Access</h2>
        <p className="mt-2 text-sm text-brown-900/70">
          Who can sign in to this dashboard is controlled by the{" "}
          <code className="rounded bg-brown-100/60 px-1.5 py-0.5 text-xs">ADMIN_EMAILS</code>{" "}
          environment variable in Vercel — a comma-separated list of allowed emails. Changing it
          requires a new deployment to take effect.
        </p>
      </section>

      <section className="mt-6 rounded-3xl bg-white/70 p-6 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-brown-900">Menu &amp; Store Info</h2>
        <p className="mt-2 text-sm text-brown-900/70">
          Menu items, prices, and store details are currently defined in the site&apos;s code
          rather than a database, so they aren&apos;t editable from here yet.
        </p>
      </section>
    </div>
  );
}
