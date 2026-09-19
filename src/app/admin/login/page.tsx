"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#1c1410] px-6">
      <div className="w-full max-w-sm rounded-3xl bg-[#2a211b] p-8 shadow-2xl ring-1 ring-white/10">
        <div className="flex flex-col items-center text-center">
          <Logo className="h-12 w-12" />
          <h1 className="mt-4 font-heading text-xl font-bold text-cream">Admin Login</h1>
          <p className="mt-1.5 text-sm text-cream/50">
            Mellow Day PH staff access only.
          </p>
        </div>

        {!isSupabaseConfigured ? (
          <p className="mt-6 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
            Accounts aren&apos;t set up on this site yet.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-cream/70">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none placeholder:text-cream/30 focus:border-white/30"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-cream/70">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-cream outline-none focus:border-white/30"
              />
            </label>

            {error && (
              <p className="rounded-xl bg-red-500/10 px-3 py-2 text-xs text-red-300">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-cream px-6 py-3 text-sm font-bold text-[#1c1410] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? "Logging in…" : "Log In"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
