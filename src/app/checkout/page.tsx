"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CartModal from "@/components/CartModal";
import CupIllustration from "@/components/CupIllustration";
import FoodIllustration from "@/components/FoodIllustration";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { MENU_ITEMS, formatPrice, isFoodCategory } from "@/lib/menu-data";
import { NCR_BARANGAYS, NCR_CITIES } from "@/lib/ncr-locations";
import { saveOrder, saveOrderRemote, type Order } from "@/lib/orders";

const MIN_AMOUNT_PESOS = 20;
const DELIVERY_FEE_PESOS = 49;

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [method, setMethod] = useState<"gcash" | "cash">("gcash");
  const [fulfillment, setFulfillment] = useState<"pickup" | "delivery">("pickup");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [barangay, setBarangay] = useState("");
  const [landmark, setLandmark] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cashConfirmed, setCashConfirmed] = useState(false);

  // Signed-in customers get their name, mobile number, and default address
  // pre-filled from their account. Name/phone stay locked to the account;
  // the address stays editable so a different one can be used per order.
  useEffect(() => {
    if (!user) return;
    queueMicrotask(() => {
      setName(user.user_metadata?.full_name ?? "");
      setPhone(user.user_metadata?.phone ?? "");
      setStreet((prev) => prev || (user.user_metadata?.default_street ?? ""));
      setCity((prev) => prev || (user.user_metadata?.default_city ?? ""));
      setBarangay((prev) => prev || (user.user_metadata?.default_barangay ?? ""));
    });
  }, [user]);

  const deliveryFee = fulfillment === "delivery" ? DELIVERY_FEE_PESOS : 0;
  const orderTotal = totalPrice + deliveryFee;

  const canSubmit =
    items.length > 0 &&
    name.trim() &&
    phone.trim() &&
    !loading &&
    (fulfillment === "pickup" || (street.trim() && city && barangay));

  const orderSummary = items
    .map((item) => `${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`)
    .join("\n");

  const deliveryAddress =
    fulfillment === "delivery"
      ? [street, barangay, city, landmark].filter(Boolean).join(", ")
      : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (method === "cash") {
      const order: Order = {
        id: `cash-${Date.now()}`,
        createdAt: new Date().toISOString(),
        method: "cash",
        status: "placed",
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: orderTotal,
        fulfillment,
        deliveryAddress,
        name,
        phone,
      };
      saveOrder(order);
      if (user) saveOrderRemote(order, user.id);
      setCashConfirmed(true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({ id: item.id, quantity: item.quantity })),
          customer: { name, phone, email },
          fulfillment: {
            method: fulfillment,
            ...(fulfillment === "delivery" ? { street, city, barangay, landmark } : {}),
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      const order: Order = {
        id: data.paymentIntentId,
        createdAt: new Date().toISOString(),
        method: "gcash",
        status: "pending",
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: orderTotal,
        fulfillment,
        deliveryAddress,
        name,
        phone,
      };
      saveOrder(order);
      if (user) saveOrderRemote(order, user.id);

      sessionStorage.setItem(
        "mellowday-payment",
        JSON.stringify({ id: data.paymentIntentId, clientKey: data.clientKey }),
      );
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  if (items.length === 0 && !cashConfirmed) {
    return (
      <div className="flex min-h-screen flex-col bg-cream text-brown-900">
        <Header />
        <main className="flex flex-1 items-center justify-center px-6 py-32 text-center">
          <div>
            <h1 className="font-heading text-2xl font-bold text-brown-900">
              Your bag is empty
            </h1>
            <p className="mt-2 text-sm text-brown-900/70">
              Add something from the menu before checking out.
            </p>
            <Link
              href="/#menu"
              className="mt-6 inline-block rounded-full bg-brown-900 px-6 py-3 text-sm font-bold text-cream hover:bg-brown-800"
            >
              Browse the Menu
            </Link>
          </div>
        </main>
        <Footer />
        <CartModal />
      </div>
    );
  }

  if (cashConfirmed) {
    return (
      <div className="flex min-h-screen flex-col bg-cream text-brown-900">
        <Header />
        <main className="flex flex-1 items-center justify-center px-6 py-32">
          <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 text-center shadow-sm">
            <h1 className="font-heading text-2xl font-bold text-brown-900">
              Order placed! 🎉
            </h1>
            <p className="mt-2 text-sm text-brown-900/70">
              Show this summary and pay cash when you pick up.
            </p>
            <pre className="mt-5 whitespace-pre-wrap rounded-2xl bg-green/20 p-4 text-left font-body text-sm text-brown-900">
              {orderSummary}
              {fulfillment === "delivery" && `\nDelivery fee: ${formatPrice(deliveryFee)}`}
              {"\n"}Total: {formatPrice(orderTotal)}
              {"\n\n"}Name: {name}
              {"\n"}Phone: {phone}
              {fulfillment === "delivery" &&
                `\nDeliver to: ${[street, barangay, city, landmark].filter(Boolean).join(", ")}`}
            </pre>
            <button
              type="button"
              onClick={() => {
                clearCart();
                router.push("/");
              }}
              className="mt-6 w-full rounded-full bg-brown-900 px-6 py-3 text-sm font-bold text-cream hover:bg-brown-800"
            >
              Back to Home
            </button>
            <Link
              href="/orders"
              className="mt-3 inline-block w-full text-center text-sm font-semibold text-brown-900/70 hover:text-brown-900"
            >
              View My Orders
            </Link>
          </div>
        </main>
        <Footer />
        <CartModal />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown-900">
      <Header />

      <main className="flex-1 px-6 py-28 md:py-32">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-heading text-3xl font-bold text-brown-900 sm:text-4xl">
            Checkout
          </h1>
          <p className="mt-2 text-sm text-brown-900/70">
            {fulfillment === "pickup"
              ? "Pickup only — we'll have it ready in about 15–20 minutes."
              : "Delivery — usually arrives within 45–60 minutes, depending on your location."}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-12"
          >
            <div className="flex flex-col gap-6 lg:col-span-7">
              <section className="rounded-3xl bg-white/70 p-6 shadow-sm sm:p-7">
                <h2 className="font-heading text-lg font-bold text-brown-900">
                  Order Method
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-2xl p-4 transition-colors ${
                      fulfillment === "pickup" ? "bg-green/25" : "bg-brown-100/30 hover:bg-brown-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        name="fulfillment"
                        value="pickup"
                        checked={fulfillment === "pickup"}
                        onChange={() => setFulfillment("pickup")}
                        className="h-4 w-4 accent-brown-900"
                      />
                      <div>
                        <span className="block text-sm font-bold text-brown-900">
                          Pickup
                        </span>
                        <span className="text-xs text-brown-900/60">
                          Ready in about 15–20 minutes
                        </span>
                      </div>
                    </div>
                  </label>
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-2xl p-4 transition-colors ${
                      fulfillment === "delivery" ? "bg-green/25" : "bg-brown-100/30 hover:bg-brown-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        name="fulfillment"
                        value="delivery"
                        checked={fulfillment === "delivery"}
                        onChange={() => setFulfillment("delivery")}
                        className="h-4 w-4 accent-brown-900"
                      />
                      <div>
                        <span className="block text-sm font-bold text-brown-900">
                          Delivery — {formatPrice(DELIVERY_FEE_PESOS)}
                        </span>
                        <span className="text-xs text-brown-900/60">
                          Estimated arrival in 45–60 minutes
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                {fulfillment === "delivery" && (
                  <div className="mt-4 flex flex-col gap-4 border-t border-brown-900/10 pt-4">
                    <label className="flex flex-col gap-1.5 text-sm">
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
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <label className="flex flex-col gap-1.5 text-sm">
                      <span className="font-semibold text-brown-900/80">
                        Landmark (optional)
                      </span>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder="e.g. Near the corner store, gate color"
                        className="rounded-2xl bg-brown-100/40 px-4 py-3 text-brown-900 outline-none focus:bg-white"
                      />
                    </label>
                  </div>
                )}
              </section>

              <section className="rounded-3xl bg-white/70 p-6 shadow-sm sm:p-7">
                <h2 className="font-heading text-lg font-bold text-brown-900">
                  Contact Details
                </h2>
                {user && (
                  <p className="mt-1 text-xs text-brown-900/60">
                    From your account — log out to use different details.
                  </p>
                )}
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-semibold text-brown-900/80">Name</span>
                    <input
                      type="text"
                      required
                      readOnly={Boolean(user)}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Juan Dela Cruz"
                      className={`rounded-2xl px-4 py-3 text-brown-900 outline-none ${
                        user ? "bg-brown-100/60 text-brown-900/70" : "bg-brown-100/40 focus:bg-white"
                      }`}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 text-sm">
                    <span className="font-semibold text-brown-900/80">Mobile Number</span>
                    <input
                      type="tel"
                      required
                      readOnly={Boolean(user)}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09XX XXX XXXX"
                      className={`rounded-2xl px-4 py-3 text-brown-900 outline-none ${
                        user ? "bg-brown-100/60 text-brown-900/70" : "bg-brown-100/40 focus:bg-white"
                      }`}
                    />
                  </label>
                </div>
                <label className="mt-4 flex flex-col gap-1.5 text-sm">
                  <span className="font-semibold text-brown-900/80">
                    Email (optional, for receipt)
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    className="rounded-2xl bg-brown-100/40 px-4 py-3 text-brown-900 outline-none focus:bg-white"
                  />
                </label>
              </section>

              <section className="rounded-3xl bg-white/70 p-6 shadow-sm sm:p-7">
                <h2 className="font-heading text-lg font-bold text-brown-900">
                  Payment Method
                </h2>
                <div className="mt-4 flex flex-col gap-3">
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-2xl p-4 transition-colors ${
                      method === "gcash" ? "bg-green/25" : "bg-brown-100/30 hover:bg-brown-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        name="method"
                        value="gcash"
                        checked={method === "gcash"}
                        onChange={() => setMethod("gcash")}
                        className="h-4 w-4 accent-brown-900"
                      />
                      <div>
                        <span className="block text-sm font-bold text-brown-900">
                          GCash
                        </span>
                        <span className="text-xs text-brown-900/60">
                          Pay online now — you&apos;ll be redirected to GCash to confirm
                        </span>
                      </div>
                    </div>
                  </label>
                  <label
                    className={`flex cursor-pointer items-center justify-between rounded-2xl p-4 transition-colors ${
                      method === "cash" ? "bg-green/25" : "bg-brown-100/30 hover:bg-brown-100/50"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <input
                        type="radio"
                        name="method"
                        value="cash"
                        checked={method === "cash"}
                        onChange={() => setMethod("cash")}
                        className="h-4 w-4 accent-brown-900"
                      />
                      <div>
                        <span className="block text-sm font-bold text-brown-900">
                          Cash on Pickup
                        </span>
                        <span className="text-xs text-brown-900/60">
                          Pay in person when you pick up your order
                        </span>
                      </div>
                    </div>
                  </label>
                </div>
              </section>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl bg-white/70 p-6 shadow-sm sm:p-7">
                <h2 className="font-heading text-lg font-bold text-brown-900">
                  Order Summary
                </h2>
                <ul className="mt-4 space-y-3">
                  {items.map((item) => {
                    const menuItem = MENU_ITEMS.find((m) => m.id === item.id);
                    const Illustration =
                      menuItem && isFoodCategory(menuItem.category) ? FoodIllustration : CupIllustration;

                    return (
                      <li key={item.id} className="flex items-center gap-3 text-sm text-brown-900">
                        <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-brown-100/40">
                          {menuItem?.image ? (
                            <Image
                              src={menuItem.image}
                              alt={item.name}
                              fill
                              className="object-contain p-0.5"
                              sizes="44px"
                            />
                          ) : (
                            <Illustration color={menuItem?.color ?? "#5C3A1E"} className="h-8 w-auto" />
                          )}
                        </div>
                        <span className="min-w-0 flex-1 truncate">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="shrink-0 font-semibold">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                {fulfillment === "delivery" && (
                  <div className="mt-4 flex items-center justify-between border-t border-brown-900/10 pt-4 text-sm text-brown-900">
                    <span>Delivery fee</span>
                    <span className="font-semibold">{formatPrice(deliveryFee)}</span>
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-brown-900/10 pt-4 text-base font-bold text-brown-900">
                  <span>Total</span>
                  <span>{formatPrice(orderTotal)}</span>
                </div>

                {orderTotal < MIN_AMOUNT_PESOS && method === "gcash" && (
                  <p className="mt-3 text-xs text-red-600">
                    Minimum order for GCash payment is {formatPrice(MIN_AMOUNT_PESOS)}.
                  </p>
                )}
                {error && (
                  <p className="mt-3 rounded-xl bg-red-100 px-3 py-2 text-xs text-red-700">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={!canSubmit || (method === "gcash" && orderTotal < MIN_AMOUNT_PESOS)}
                  className="mt-5 w-full rounded-full bg-brown-900 px-6 py-4 text-sm font-bold text-cream shadow-lg shadow-brown-900/20 transition-transform hover:-translate-y-0.5 hover:bg-brown-800 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
                >
                  {loading
                    ? "Redirecting to GCash…"
                    : method === "gcash"
                      ? `Pay with GCash — ${formatPrice(orderTotal)}`
                      : `Place Order — ${formatPrice(orderTotal)}`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
      <CartModal />
    </div>
  );
}
