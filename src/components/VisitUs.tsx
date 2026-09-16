import Reveal from "./Reveal";
import { IconPin } from "./icons";

export default function VisitUs() {
  return (
    <section id="visit" className="bg-cream px-6 py-20 md:py-28 lg:py-32">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-brown-900 via-brown-800 to-brown-700 px-6 py-16 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-10 -top-10 h-56 w-56 rounded-full bg-green/20 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -bottom-10 h-56 w-56 rounded-full bg-gold/15 blur-3xl"
          />

          <IconPin className="mx-auto h-8 w-8 text-cream/80" />
          <h2 className="mt-4 font-heading text-3xl font-extrabold text-cream sm:text-4xl lg:text-5xl">
            Visit Us
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-cream/80">
            Find your nearest Mellow Day PH branch and drop by for a cup
            made just for you.
          </p>
          <a
            href="https://www.google.com/maps/search/Mellow+Day+PH"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-block rounded-full bg-cream px-7 py-3.5 text-sm font-bold text-brown-900 shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
          >
            Find a Store
          </a>

          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-3 bg-[repeating-linear-gradient(90deg,transparent,transparent_14px,rgba(253,247,236,0.25)_14px,rgba(253,247,236,0.25)_16px)]"
          />
        </div>
      </Reveal>
    </section>
  );
}
