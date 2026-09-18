"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CartModal from "@/components/CartModal";
import CupIllustration from "@/components/CupIllustration";
import FoodIllustration from "@/components/FoodIllustration";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { MENU_ITEMS, formatPrice, isFoodCategory } from "@/lib/menu-data";
import { getOrders, type Order, type OrderStatus } from "@/lib/orders";

const STATUS_LABEL: Record<OrderStatus, string> = {
  paid: "Paid",
  placed: "Placed — pay on pickup",
  pending: "Payment pending",
  failed: "Payment failed",
};

const STATUS_STYLE: Record<OrderStatus, string> = {
  paid: "bg-green/40 text-brown-900",
  placed: "bg-green/40 text-brown-900",
  pending: "bg-gold/30 text-brown-900",
  failed: "bg-red-100 text-red-700",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      setOrders(getOrders());
      setHydrated(true);
    });
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown-900">
      <Header />

      <main className="flex-1 px-6 py-28 md:py-32">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-heading text-3xl font-bold text-brown-900 sm:text-4xl">
            My Orders
          </h1>
          <p className="mt-2 text-sm text-brown-900/70">
            Orders placed from this device — a running list of everything you&apos;ve
            ordered from Mellow Day PH.
          </p>

          {hydrated && orders.length === 0 && (
            <div className="mt-10 rounded-3xl bg-white/70 p-10 text-center shadow-sm">
              <p className="text-sm text-brown-900/70">
                You haven&apos;t placed any orders yet.
              </p>
              <Link
                href="/#menu"
                className="mt-5 inline-block rounded-full bg-brown-900 px-6 py-3 text-sm font-bold text-cream hover:bg-brown-800"
              >
                Browse the Menu
              </Link>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-5">
            {orders.map((order) => (
              <div key={order.id} className="rounded-3xl bg-white/70 p-6 shadow-sm sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                      {formatDate(order.createdAt)}
                    </p>
                    <p className="mt-0.5 text-sm font-bold text-brown-900">
                      {order.fulfillment === "delivery" ? "Delivery" : "Pickup"} &middot;{" "}
                      {order.method === "gcash" ? "GCash" : "Cash"}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[order.status]}`}
                  >
                    {STATUS_LABEL[order.status]}
                  </span>
                </div>

                <ul className="mt-4 space-y-3 border-t border-brown-900/10 pt-4">
                  {order.items.map((item) => {
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

                {order.fulfillment === "delivery" && order.deliveryAddress && (
                  <p className="mt-4 text-xs text-brown-900/60">
                    Delivered to: {order.deliveryAddress}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-brown-900/10 pt-4 text-base font-bold text-brown-900">
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
      <CartModal />
    </div>
  );
}
