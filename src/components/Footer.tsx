import Logo from "./Logo";
import { IconClock, IconFacebook, IconInstagram, IconPhone, IconPin } from "./icons";

const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61587137513893";
const INSTAGRAM_URL = "https://www.instagram.com/mellowday.ph/";
const MAP_URL = "https://maps.app.goo.gl/dfmAK4aCdw8itYY2A";

export default function Footer({ className = "bg-green" }: { className?: string }) {
  return (
    <footer className={`mt-auto px-6 pb-7 pt-3 sm:px-10 md:pb-9 md:pt-4 ${className}`}>
      <div className="mx-auto max-w-4xl">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
            <Logo className="h-16 w-16 sm:h-20 sm:w-20" />
            <span className="mt-1.5 font-heading text-xl font-bold text-brown-900">
              Mellow Day
            </span>

            <div className="mt-2.5 flex gap-4">
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
            <p className="mt-1.5 text-xs font-semibold text-brown-900/60">
              Follow us on Facebook and Instagram
            </p>
          </div>

          <div className="flex flex-col items-center text-center sm:items-start sm:justify-end sm:text-left">
            <h3 className="font-heading text-base font-bold text-brown-900">Contact Us</h3>
            <div className="mt-2 flex flex-col items-center gap-2 text-sm text-brown-900/80 sm:items-start">
              <div className="flex items-center gap-2.5">
                <IconPin className="h-4 w-4 shrink-0 text-brown-900/60" />
                <a href={MAP_URL} target="_blank" rel="noreferrer" className="hover:underline">
                  Corner Saint Mary, Central Signal Village, Taguig City
                </a>
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
          </div>
        </div>

        <div className="mt-5 border-t border-brown-900/15 pt-3 text-center text-xs text-brown-900/70">
          &copy; {new Date().getFullYear()} Mellow Day PH. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
