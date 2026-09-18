"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NCR_BARANGAYS, NCR_CITIES } from "@/lib/ncr-locations";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

const NAME_PATTERN = /^[A-Za-zÀ-ÖØ-öø-ÿ.'-]+(?:\s+[A-Za-zÀ-ÖØ-öø-ÿ.'-]+)+$/;
const PH_MOBILE_PATTERN = /^09\d{9}$/;

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (!NAME_PATTERN.test(name.trim())) {
      setError("Please enter your full real name (first and last name).");
      return;
    }
    if (!PH_MOBILE_PATTERN.test(phone.trim())) {
      setError("Please enter a valid mobile number (e.g. 09171234567).");
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name.trim(),
          phone: phone.trim(),
          default_street: street.trim(),
          default_barangay: barangay,
          default_city: city,
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    });

    setLoading(false);
    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // Supabase deliberately returns a "successful" response with no error
    // for an email that's already registered (to avoid leaking which
    // emails exist) — an empty identities array is the actual signal.
    if (data.user && data.user.identities && data.user.identities.length === 0) {
      setError("This email is already registered. Try logging in instead.");
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
        <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 shadow-sm">
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
                <span className="font-semibold text-brown-900/80">Full Name</span>
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
                <span className="font-semibold text-brown-900/80">Mobile Number</span>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="09XX XXX XXXX"
                  className="rounded-2xl bg-brown-100/40 px-4 py-3 text-brown-900 outline-none focus:bg-white"
                />
              </label>

              <div className="border-t border-brown-900/10 pt-4">
                <p className="text-sm font-semibold text-brown-900/80">Default Address</p>
                <p className="mt-1 text-xs text-brown-900/60">
                  Used to pre-fill delivery at checkout — Metro Manila only for now.
                </p>

                <label className="mt-3 flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold text-brown-900/80">Street Address</span>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="House/Unit No., Street"
                    className="rounded-2xl bg-brown-100/40 px-4 py-3 text-brown-900 outline-none focus:bg-white"
                  />
                </label>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-semibold text-brown-900/80">City</span>
                    <select
                      required
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setBarangay("");
                      }}
                      className="rounded-2xl bg-brown-100/40 px-4 py-3 text-brown-900 outline-none focus:bg-white"
                    >
                      <option value="" disabled>
                        Select city
                      </option>
                      {NCR_CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-semibold text-brown-900/80">Barangay</span>
                    <select
                      required
                      disabled={!city}
                      value={barangay}
                      onChange={(e) => setBarangay(e.target.value)}
                      className="rounded-2xl bg-brown-100/40 px-4 py-3 text-brown-900 outline-none focus:bg-white disabled:opacity-50"
                    >
                      <option value="" disabled>
                        {city ? "Select barangay" : "Select city first"}
                      </option>
                      {(NCR_BARANGAYS[city] ?? []).map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>

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
