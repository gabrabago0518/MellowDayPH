"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function LoginPage() {
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

    router.push("/orders");
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown-900">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-32">
        <div className="w-full max-w-sm rounded-3xl bg-white/70 p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-brown-900">Log In</h1>
          <p className="mt-2 text-sm text-brown-900/70">
            Welcome back — log in to see your order history.
          </p>

          {!isSupabaseConfigured ? (
            <p className="mt-6 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
              Accounts aren&apos;t set up on this site yet. Please check back later.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-brown-900/80">Email</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="rounded-2xl bg-brown-100/40 px-4 py-3 text-brown-900 outline-none focus:bg-white"
                />
              </label>
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-brown-900/80">Password</span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-2xl bg-brown-100/40 px-4 py-3 text-brown-900 outline-none focus:bg-white"
                />
              </label>

              {error && (
                <p className="rounded-xl bg-red-100 px-3 py-2 text-xs text-red-700">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 rounded-full bg-brown-900 px-6 py-3 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5 hover:bg-brown-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? "Logging in…" : "Log In"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-brown-900/70">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-brown-900 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
