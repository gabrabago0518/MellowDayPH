"use client";

import { useState } from "react";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/menu-data";
import { IconClose, IconMinus, IconPlus, IconTrash } from "./icons";

export default function CartDrawer() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    totalItems,
    totalPrice,
    isOpen,
    closeCart,
  } = useCart();
  const [checkedOut, setCheckedOut] = useState(false);
  const [copied, setCopied] = useState(false);

  const close = () => {
    closeCart();
    setCheckedOut(false);
    setCopied(false);
  };

  const orderSummary = items
    .map((item) => `${item.quantity}x ${item.name} — ${formatPrice(item.price * item.quantity)}`)
    .join("\n");

  const copyOrder = async () => {
    try {
      await navigator.clipboard.writeText(
        `Mellow Day PH order:\n${orderSummary}\nTotal: ${formatPrice(totalPrice)}`,
      );
      setCopied(true);
    } catch {
      // clipboard unavailable — the summary is still shown on screen
    }
  };

  return (
    <>
      <div
        aria-hidden={!isOpen}
        onClick={close}
        className={`fixed inset-0 z-[60] bg-brown-900/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        role="dialog"
        aria-label="Shopping cart"
        aria-hidden={!isOpen}
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-brown-100 px-5 py-4">
          <h2 className="font-heading text-lg font-bold text-brown-900">
            Your Cart {totalItems > 0 && `(${totalItems})`}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close cart"
            className="rounded-full p-1.5 text-brown-900 hover:bg-brown-100/60"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-brown-900/60">
              Your cart is empty. Add a drink from the menu to get started.
            </p>
          ) : checkedOut ? (
            <div>
              <p className="text-sm font-semibold text-brown-900">
                Thanks! Here&apos;s your order summary:
              </p>
              <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-green/20 p-4 font-body text-sm text-brown-900">
                {orderSummary}
                {"\n"}Total: {formatPrice(totalPrice)}
              </pre>
              <p className="mt-3 text-xs text-brown-900/70">
                Online payment isn&apos;t set up yet — copy this order and
                send it to us on Facebook/Instagram, or read it out when you
                drop by, to complete your purchase.
              </p>
              <button
                type="button"
                onClick={copyOrder}
                className="mt-4 w-full rounded-full bg-brown-900 px-5 py-3 text-sm font-bold text-cream hover:bg-brown-800"
              >
                {copied ? "Copied!" : "Copy Order Summary"}
              </button>
              <button
                type="button"
                onClick={() => {
                  clearCart();
                  setCheckedOut(false);
                  setCopied(false);
                }}
                className="mt-2 w-full rounded-full border-2 border-brown-900/30 px-5 py-3 text-sm font-bold text-brown-900 hover:bg-brown-100/60"
              >
                Start a New Order
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-brown-900">
                      {item.name}
                    </p>
                    <p className="text-xs text-brown-900/60">
                      {formatPrice(item.price)} each
                    </p>
                  </div>

                  <div className="flex items-center gap-2 rounded-full bg-brown-100/60 px-2 py-1">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-brown-900 hover:bg-cream"
                    >
                      <IconMinus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-4 text-center text-sm font-semibold text-brown-900">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-full text-brown-900 hover:bg-cream"
                    >
                      <IconPlus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <p className="w-14 shrink-0 text-right text-sm font-bold text-brown-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>

                  <button
                    type="button"
                    aria-label={`Remove ${item.name} from cart`}
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 text-brown-900/50 hover:text-brown-900"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && !checkedOut && (
          <div className="border-t border-brown-100 px-5 py-4">
            <div className="flex items-center justify-between text-sm font-semibold text-brown-900">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <button
              type="button"
              onClick={() => setCheckedOut(true)}
              className="mt-3 w-full rounded-full bg-brown-900 px-5 py-3 text-sm font-bold text-cream hover:bg-brown-800"
            >
              Checkout
            </button>
            <button
              type="button"
              onClick={clearCart}
              className="mt-2 w-full text-center text-xs font-semibold text-brown-900/60 hover:text-brown-900"
            >
              Clear Cart
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
