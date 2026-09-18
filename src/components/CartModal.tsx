"use client";

import Image from "next/image";
import Link from "next/link";
import CupIllustration from "./CupIllustration";
import FoodIllustration from "./FoodIllustration";
import Logo from "./Logo";
import { useCart } from "@/lib/CartContext";
import { MENU_ITEMS, formatPrice, isFoodCategory } from "@/lib/menu-data";
import { IconArrowRight, IconClose, IconMinus, IconPlus, IconTrash } from "./icons";

export default function CartModal() {
  const { items, updateQuantity, removeItem, clearCart, totalItems, totalPrice, isOpen, closeCart } =
    useCart();

  return (
    <div
      aria-hidden={!isOpen}
      onClick={closeCart}
      className={`fixed inset-0 z-[60] flex items-center justify-center bg-brown-900/50 p-4 backdrop-blur-sm transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div
        role="dialog"
        aria-label="Your Mellow Bag"
        onClick={(e) => e.stopPropagation()}
        className={`flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-cream shadow-2xl transition-all duration-300 ${
          isOpen ? "translate-y-0 scale-100 opacity-100" : "translate-y-4 scale-95 opacity-0"
        }`}
      >
        <div className="flex items-center justify-between gap-4 border-b border-brown-100 px-6 py-5">
          <div className="flex items-center gap-3">
            <Logo className="h-11 w-11" />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading text-lg font-bold text-brown-900">
                  Your Mellow Bag
                </h2>
                {totalItems > 0 && (
                  <span className="rounded-full bg-green/40 px-2.5 py-0.5 text-xs font-bold text-brown-900">
                    {totalItems} {totalItems === 1 ? "treat" : "treats"}
                  </span>
                )}
              </div>
              <p className="text-xs text-brown-900/60">Freshly handcrafted to order</p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close bag"
            className="rounded-full p-1.5 text-brown-900 transition-transform hover:scale-105 hover:bg-brown-100/60"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {items.length === 0 ? (
            <p className="mt-10 text-center text-sm text-brown-900/60">
              Your bag is empty. Add a drink from the menu to get started.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => {
                const menuItem = MENU_ITEMS.find((m) => m.id === item.id);
                const Illustration = menuItem && isFoodCategory(menuItem.category)
                  ? FoodIllustration
                  : CupIllustration;

                return (
                <li
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl bg-white/70 p-3 shadow-sm"
                >
                  <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-cream">
                    {menuItem?.image ? (
                      <Image
                        src={menuItem.image}
                        alt={item.name}
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    ) : (
                      <Illustration color={menuItem?.color ?? "#5C3A1E"} className="h-10 w-auto" />
                    )}
                  </div>

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
                    aria-label={`Remove ${item.name} from bag`}
                    onClick={() => removeItem(item.id)}
                    className="shrink-0 text-brown-900/50 hover:text-brown-900"
                  >
                    <IconTrash className="h-4 w-4" />
                  </button>
                </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-brown-100 px-6 py-5">
            <Link
              href="/checkout"
              onClick={closeCart}
              className="flex w-full items-center justify-between rounded-full bg-brown-900 px-6 py-4 text-sm font-bold text-cream shadow-lg shadow-brown-900/20 transition-transform hover:-translate-y-0.5 hover:bg-brown-800"
            >
              <span>Proceed to Checkout</span>
              <span className="flex items-center gap-1.5">
                {formatPrice(totalPrice)}
                <IconArrowRight className="h-4 w-4" />
              </span>
            </Link>
            <button
              type="button"
              onClick={clearCart}
              className="mt-2 w-full text-center text-xs font-semibold text-brown-900/60 hover:text-brown-900"
            >
              Clear Bag
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
