"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CartModal from "@/components/CartModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";
import { NCR_BARANGAYS, NCR_CITIES } from "@/lib/ncr-locations";
import { PH_MOBILE_PATTERN } from "@/lib/validation";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      setPhone((user.user_metadata?.phone as string) ?? "");
      setStreet((user.user_metadata?.default_street as string) ?? "");
      setCity((user.user_metadata?.default_city as string) ?? "");
      setBarangay((user.user_metadata?.default_barangay as string) ?? "");
    });
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login?redirect=/profile");
  }, [authLoading, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;

    if (!PH_MOBILE_PATTERN.test(phone.trim())) {
      setError("Please enter a valid mobile number (e.g. 09171234567).");
      return;
    }

    setSaving(true);
    setError(null);
    setSaved(false);

    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        phone: phone.trim(),
        default_street: street.trim(),
        default_city: city,
        default_barangay: barangay,
      },
    });

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
  };

  if (authLoading || !user) {
    return (
      <div className="flex min-h-screen flex-col bg-cream text-brown-900">
        <Header />
        <main className="flex flex-1 items-center justify-center px-6 py-32">
          <p className="text-sm text-brown-900/60">Loading…</p>
        </main>
        <Footer />
        <CartModal />
      </div>
    );
  }

  const fullName = (user.user_metadata?.full_name as string) ?? "";

  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown-900">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-32">
        <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 shadow-sm">
          <h1 className="font-heading text-2xl font-bold text-brown-900">My Profile</h1>
          <p className="mt-2 text-sm text-brown-900/70">
            Update your mobile number and default delivery address.
          </p>

          <div className="mt-6 flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-brown-900/80">Full Name</span>
            <p className="rounded-2xl bg-brown-100/40 px-4 py-3 text-brown-900/70">
              {fullName || "—"}
            </p>
          </div>
          <div className="mt-3 flex flex-col gap-1.5 text-sm">
            <span className="font-semibold text-brown-900/80">Email</span>
            <p className="rounded-2xl bg-brown-100/40 px-4 py-3 text-brown-900/70">{user.email}</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-3 flex flex-col gap-4">
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

            {error && (
              <p className="rounded-xl bg-red-100 px-3 py-2 text-xs text-red-700">{error}</p>
            )}
            {saved && (
              <p className="rounded-xl bg-green/20 px-3 py-2 text-xs text-brown-900">
                Profile updated.
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-2 rounded-full bg-brown-900 px-6 py-3 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5 hover:bg-brown-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>
      </main>
      <Footer />
      <CartModal />
    </div>
  );
}
