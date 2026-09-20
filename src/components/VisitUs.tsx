import Image from "next/image";
import Reveal from "./Reveal";
import { IconPin } from "./icons";

export default function VisitUs() {
  return (
    <section id="visit" className="bg-cream px-6 py-20 md:py-28 lg:py-32">
      <Reveal className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[2.5rem] px-6 py-16 text-center sm:px-12">
          <Image
            src="/visit-us-bg.jpg"
            alt="The Mellow Day PH storefront"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-brown-900/70" />

          <IconPin className="relative mx-auto h-8 w-8 text-cream/80" />
          <h2 className="relative mt-4 font-heading text-3xl font-extrabold text-cream sm:text-4xl lg:text-5xl">
            Visit Us
          </h2>
          <p className="relative mx-auto mt-3 max-w-md text-sm text-cream/80">
            Find your nearest Mellow Day PH branch and drop by for a cup
            made just for you.
          </p>
          <a
            href="https://maps.app.goo.gl/dfmAK4aCdw8itYY2A"
            target="_blank"
            rel="noreferrer"
            className="relative mt-8 inline-block rounded-full bg-cream px-7 py-3.5 text-sm font-bold text-brown-900 shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
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
