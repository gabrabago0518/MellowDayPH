import Logo from "./Logo";
import { IconClock, IconFacebook, IconInstagram, IconPhone, IconPin } from "./icons";

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61587137513893";
const INSTAGRAM_URL = "https://www.instagram.com/mellowday.ph/";

export default function Footer({ className = "bg-green" }: { className?: string }) {
  return (
    <footer className={`mt-auto px-6 py-10 sm:px-10 md:py-14 ${className}`}>
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <Logo className="h-28 w-28 sm:h-32 sm:w-32" />
        <span className="mt-2 font-heading text-2xl font-bold text-brown-900">
          Mellow Day
        </span>

        <div className="mt-4 flex gap-4">
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
        <p className="mt-2 text-xs font-semibold text-brown-900/60">
          Follow us on Facebook and Instagram
        </p>

        <div className="mt-6 flex flex-col items-center gap-2.5 text-sm text-brown-900/80">
          <div className="flex items-center gap-2.5">
            <IconPin className="h-4 w-4 shrink-0 text-brown-900/60" />
            <span>Corner Saint Mary, Central Signal Village, Taguig City</span>
          </div>
          <div className="flex items-center gap-2.5">
            <IconClock className="h-4 w-4 shrink-0 text-brown-900/60" />
            <span>Open daily from 8:00 AM to 12:00 AM</span>
          </div>
          <div className="flex items-center gap-2.5">
            <IconPhone className="h-4 w-4 shrink-0 text-brown-900/60" />
            <a href="tel:+639763933039" className="hover:underline">
              +63 976 393 3039
            </a>
          </div>
        </div>

        <div className="mt-6 w-full border-t border-brown-900/15 pt-5 text-xs text-brown-900/70">
          &copy; {new Date().getFullYear()} Mellow Day PH. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
