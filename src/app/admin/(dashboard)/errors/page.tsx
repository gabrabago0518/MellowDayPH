"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";

type ErrorLog = {
  id: string;
  source: "server" | "client";
  route: string | null;
  message: string;
  stack: string | null;
  context: Record<string, unknown> | null;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function AdminErrorsPage() {
  const [errors, setErrors] = useState<ErrorLog[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await adminFetch("/api/admin/errors");
        if (cancelled) return;
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error || "Couldn't load errors.");
          return;
        }
        const body = await res.json();
        setErrors(body.errors);
      } catch {
        if (!cancelled) setError("Couldn't load errors.");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown-900 sm:text-4xl">Errors</h1>
      <p className="mt-2 text-sm text-brown-900/70">
        The last 100 errors caught on the site — checkout/order failures (server) and page crashes a
        visitor hit (client). Server errors on the payment path also alert automatically; this page is
        for everything else, and for digging into what actually happened.
      </p>

      {error && (
        <div className="mt-10 rounded-3xl bg-white/70 p-8 text-center shadow-sm">
          <p className="text-sm text-brown-900/70">{error}</p>
        </div>
      )}

      {!errors && !error && <p className="mt-10 text-sm text-brown-900/60">Loading…</p>}

      {errors && (
        <div className="mt-6 flex flex-col gap-3">
          {errors.map((e) => (
            <div key={e.id} className="rounded-2xl bg-white/70 p-4 shadow-sm">
              <button
                type="button"
                onClick={() => setExpandedId((prev) => (prev === e.id ? null : e.id))}
                className="flex w-full flex-wrap items-center gap-3 text-left"
              >
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                    e.source === "server" ? "bg-red-100 text-red-700" : "bg-brown-100 text-brown-900/70"
                  }`}
                >
                  {e.source}
                </span>
                <span className="shrink-0 text-xs text-brown-900/50">{formatDate(e.created_at)}</span>
                {e.route && (
                  <span className="shrink-0 rounded-full bg-brown-100/60 px-2.5 py-1 text-xs font-mono text-brown-900/70">
                    {e.route}
                  </span>
                )}
                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-brown-900">
                  {e.message}
                </span>
              </button>
              {expandedId === e.id && (
                <div className="mt-3 border-t border-brown-900/10 pt-3">
                  {e.context && (
                    <pre className="overflow-x-auto rounded-xl bg-brown-100/30 p-3 text-xs text-brown-900/80">
                      {JSON.stringify(e.context, null, 2)}
                    </pre>
                  )}
                  {e.stack && (
                    <pre className="mt-2 overflow-x-auto rounded-xl bg-brown-900/90 p-3 text-xs text-cream/90">
                      {e.stack}
                    </pre>
                  )}
                </div>
              )}
            </div>
          ))}
          {errors.length === 0 && (
            <div className="rounded-3xl bg-white/70 p-10 text-center shadow-sm">
              <p className="text-sm text-brown-900/60">No errors logged yet — good sign.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
