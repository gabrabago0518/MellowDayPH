import Logo from "./Logo";
import { IconFacebook, IconInstagram } from "./icons";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#menu", label: "Order" },
];

export default function Footer() {
  return (
    <footer className="mt-auto rounded-t-[83px] bg-green px-6 py-10 sm:px-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-heading text-xl font-bold text-brown-900">
              Mellow Day
            </span>
          </div>

          <div className="flex gap-4 pt-1">
            <a
              href="#"
              aria-label="Mellow Day PH on Facebook"
              className="text-brown-900 transition-transform hover:-translate-y-0.5"
            >
              <IconFacebook className="h-6 w-6" />
            </a>
            <a
              href="#"
              aria-label="Mellow Day PH on Instagram"
              className="text-brown-900 transition-transform hover:-translate-y-0.5"
            >
              <IconInstagram className="h-6 w-6" />
            </a>
          </div>
        </div>

        <nav className="mt-4 flex flex-wrap gap-6 text-sm font-semibold text-brown-900">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="transition-colors hover:text-brown-700"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="mt-6 border-t border-brown-900/15 pt-5 text-center text-xs text-brown-900/70">
          &copy; {new Date().getFullYear()} Mellow Day PH. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
