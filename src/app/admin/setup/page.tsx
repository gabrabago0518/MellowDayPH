"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function AdminSetupPage() {
  const [setupKey, setSetupKey] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/auth/setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ setupKey, fullName, username, password }),
    });

    setLoading(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Something went wrong.");
      return;
    }

    setDone(true);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1c1410] px-6">
      <div className="w-full max-w-sm rounded-3xl bg-[#2a211b] p-8 shadow-2xl ring-1 ring-white/10">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-12 w-12" />
          <h1 className="mt-4 font-heading text-xl font-bold text-cream">Create Admin Account</h1>
          <p className="mt-1.5 text-sm text-cream/50">
            Requires the server&apos;s admin setup key.
          </p>
        </div>

        {done ? (
          <div className="mt-6 rounded-xl bg-green/10 px-4 py-3 text-center text-sm text-cream/80">
            Admin account created.{" "}
            <Link href="/admin/login" className="font-semibold text-cream underline">
              Log in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-cream/70">Setup Key</span>
              <input
                type="password"
                required
                value={setupKey}
                onChange={(e) => setSetupKey(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none focus:border-white/30"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-cream/70">Full Name</span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none focus:border-white/30"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-cream/70">Username</span>
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none focus:border-white/30"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-cream/70">Password</span>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none focus:border-white/30"
              />
              <span className="text-xs text-cream/40">At least 8 characters.</span>
            </label>

            {error && (
              <p className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-cream px-6 py-3 text-sm font-bold text-[#1c1410] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Creating…" : "Create Admin"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
