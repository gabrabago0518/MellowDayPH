"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });

    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    if (data.session) {
      router.push("/orders");
    } else {
      setCheckEmail(true);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown-900">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-32">
        <div className="w-full max-w-sm rounded-3xl bg-white/70 p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-brown-900">Sign Up</h1>
          <p className="mt-2 text-sm text-brown-900/70">
            Create an account to keep track of your orders.
          </p>

          {!isSupabaseConfigured ? (
            <p className="mt-6 rounded-xl bg-red-100 px-4 py-3 text-sm text-red-700">
              Accounts aren&apos;t set up on this site yet. Please check back later.
            </p>
          ) : checkEmail ? (
            <p className="mt-6 rounded-xl bg-green/20 px-4 py-3 text-sm text-brown-900">
              Almost there — check <strong>{email}</strong> for a confirmation link to
              finish signing up.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <label className="flex flex-col gap-1.5 text-sm">
                <span className="font-semibold text-brown-900/80">Name</span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Dela Cruz"
                  className="rounded-2xl bg-brown-100/40 px-4 py-3 text-brown-900 outline-none focus:bg-white"
                />
              </label>
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
                  minLength={6}
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
                {loading ? "Signing up…" : "Sign Up"}
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-brown-900/70">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brown-900 hover:underline">
              Log In
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
