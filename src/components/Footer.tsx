import Logo from "./Logo";
import { IconFacebook, IconInstagram } from "./icons";

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#visit", label: "Visit Us" },
];

export default function Footer() {
  return (
    <footer className="mt-auto bg-green">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="font-heading text-xl font-bold text-brown-900">
              Mellow Day
            </span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm font-semibold text-brown-900">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-brown-700">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex gap-3">
            <a
              href="#"
              aria-label="Mellow Day PH on Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-brown-900 transition-transform hover:-translate-y-0.5"
            >
              <IconFacebook className="h-4 w-4" />
            </a>
            <a
              href="#"
              aria-label="Mellow Day PH on Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-cream text-brown-900 transition-transform hover:-translate-y-0.5"
            >
              <IconInstagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-brown-900/15 pt-6 text-center text-xs text-brown-900/70">
          &copy; {new Date().getFullYear()} Mellow Day PH. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
