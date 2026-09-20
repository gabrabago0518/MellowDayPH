import Link from "next/link";
import Logo from "./Logo";
import { IconClock, IconFacebook, IconInstagram, IconPhone, IconPin } from "./icons";

const NAV_LINKS = [
  { href: "/#home", label: "Home" },
  { href: "/#about", label: "About" },
  { href: "/menu", label: "Menu" },
  { href: "/menu", label: "Order" },
];

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61587137513893";
const INSTAGRAM_URL = "https://www.instagram.com/mellowday.ph/";

export default function Footer({ className = "bg-green" }: { className?: string }) {
  return (
    <footer className={`mt-auto px-6 py-10 sm:px-10 md:py-14 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="flex items-start justify-between gap-6">
          <div className="flex flex-col items-center gap-2">
            <Logo className="h-20 w-20" />
            <span className="font-heading text-xl font-bold text-brown-900">
              Mellow Day
            </span>
          </div>

          <div className="flex gap-4 pt-1">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Mellow Day PH on Facebook"
              className="text-brown-900 transition-transform hover:-translate-y-0.5"
            >
              <IconFacebook className="h-6 w-6" />
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="Mellow Day PH on Instagram"
              className="text-brown-900 transition-transform hover:-translate-y-0.5"
            >
              <IconInstagram className="h-6 w-6" />
            </a>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
          <nav className="flex flex-wrap gap-6 text-sm font-semibold text-brown-900">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-brown-700"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col gap-2.5 text-sm text-brown-900/80">
            <div className="flex items-start gap-2.5">
              <IconPin className="mt-0.5 h-4 w-4 shrink-0 text-brown-900/60" />
              <span>Corner Saint Mary, Central Signal Village, Taguig City</span>
            </div>
            <div className="flex items-start gap-2.5">
              <IconClock className="mt-0.5 h-4 w-4 shrink-0 text-brown-900/60" />
              <span>Open daily from 8:00 AM to 12:00 AM</span>
            </div>
            <div className="flex items-start gap-2.5">
              <IconPhone className="mt-0.5 h-4 w-4 shrink-0 text-brown-900/60" />
              <a href="tel:+639763933039" className="hover:underline">
                +63 976 393 3039
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-brown-900/15 pt-5 text-center text-xs text-brown-900/70">
          &copy; {new Date().getFullYear()} Mellow Day PH. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
