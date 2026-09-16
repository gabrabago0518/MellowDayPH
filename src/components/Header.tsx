"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import { useCart } from "@/lib/CartContext";
import { IconCart, IconClose, IconMenu } from "./icons";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#visit", label: "Visit Us" },
];

function CartButton({ className = "" }: { className?: string }) {
  const { totalItems, openCart } = useCart();
  return (
    <button
      type="button"
      onClick={openCart}
      aria-label={`Open cart${totalItems > 0 ? ` (${totalItems} items)` : ""}`}
      className={`relative rounded-full p-2 text-brown-900 hover:bg-brown-100/60 ${className}`}
    >
      <IconCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-green px-1 text-[10px] font-bold text-brown-900">
          {totalItems}
        </span>
      )}
    </button>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-brown-100 bg-cream/95 shadow-sm backdrop-blur"
          : "border-transparent bg-cream"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <a href="#home" className="flex items-center gap-3">
          <Logo />
          <span className="font-heading text-lg font-bold text-brown-900">
            Mellow Day
          </span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-semibold text-brown-800 md:flex">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="transition-colors hover:text-brown-900">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <CartButton />
          <a
            href="#menu"
            className="rounded-full bg-brown-900 px-5 py-2.5 text-sm font-semibold text-cream transition-transform hover:-translate-y-0.5 hover:bg-brown-800"
          >
            Order Now
          </a>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <CartButton />
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
            className="rounded-full p-2 text-brown-900"
          >
            {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <div
        className={`overflow-hidden transition-[max-height,opacity] duration-300 md:hidden ${
          open ? "max-h-72 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1 border-t border-brown-100 bg-cream px-6 py-4 text-sm font-semibold text-brown-800">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 transition-colors hover:bg-brown-100/60"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#menu"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-brown-900 px-5 py-2.5 text-center text-cream"
          >
            Order Now
          </a>
        </nav>
      </div>
    </header>
  );
}
