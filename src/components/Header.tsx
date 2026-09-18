"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { useAuth } from "@/lib/AuthContext";
import { useCart } from "@/lib/CartContext";
import { IconCart, IconClose, IconMenu } from "./icons";

const NAV_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/#menu", label: "Menu" },
  { href: "/#visit", label: "Visit Us" },
  { href: "/orders", label: "My Orders" },
];

function CartButton({ className = "" }: { className?: string }) {
  const { totalItems, isOpen, openCart, closeCart } = useCart();
  return (
    <button
      type="button"
      onClick={() => (isOpen ? closeCart() : openCart())}
      aria-label={`${isOpen ? "Close" : "Open"} bag${totalItems > 0 ? ` (${totalItems} items)` : ""}`}
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

function AccountLinks({ mobile = false, onNavigate }: { mobile?: boolean; onNavigate?: () => void }) {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <Link
        href="/login"
        onClick={onNavigate}
        className={
          mobile
            ? "rounded-lg px-2 py-2.5 transition-colors hover:bg-brown-100/60"
            : "text-base font-semibold text-brown-800 transition-colors hover:text-brown-900"
        }
      >
        Log In
      </Link>
    );
  }

  const displayName = user.user_metadata?.full_name?.split(" ")[0] || user.email?.split("@")[0];

  if (mobile) {
    return (
      <button
        type="button"
        onClick={() => {
          signOut();
          onNavigate?.();
        }}
        className="rounded-lg px-2 py-2.5 text-left transition-colors hover:bg-brown-100/60"
      >
        Log Out ({displayName})
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-brown-800">
      <span>Hi, {displayName}</span>
      <button
        type="button"
        onClick={() => signOut()}
        className="text-brown-900/60 underline-offset-2 transition-colors hover:text-brown-900 hover:underline"
      >
        Log Out
      </button>
    </div>
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
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div
          className={`flex items-center justify-between rounded-full bg-cream/95 px-6 py-4 shadow-lg shadow-brown-900/10 backdrop-blur-md transition-shadow duration-300 sm:py-5 ${
            scrolled ? "shadow-xl shadow-brown-900/15" : ""
          }`}
        >
          <Link href="/#home" className="flex items-center gap-3">
            <Logo className="h-12 w-12 sm:h-14 sm:w-14" />
            <span className="font-heading text-xl font-bold text-brown-900 sm:text-2xl">
              Mellow Day
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-base font-semibold text-brown-800 md:flex">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="transition-colors hover:text-brown-900">
                {link.label}
              </Link>
            ))}
            <AccountLinks />
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <CartButton />
            <Link
              href="/#menu"
              className="rounded-full bg-brown-900 px-6 py-3.5 text-base font-semibold text-cream transition-transform hover:-translate-y-0.5 hover:bg-brown-800"
            >
              Order Now
            </Link>
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
            open ? "mt-2 max-h-[30rem] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-1 rounded-3xl bg-cream/95 px-6 py-4 text-sm font-semibold text-brown-800 shadow-lg shadow-brown-900/10 backdrop-blur-md">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 transition-colors hover:bg-brown-100/60"
              >
                {link.label}
              </Link>
            ))}
            <AccountLinks mobile onNavigate={() => setOpen(false)} />
            <Link
              href="/#menu"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-brown-900 px-5 py-2.5 text-center text-cream"
            >
              Order Now
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
