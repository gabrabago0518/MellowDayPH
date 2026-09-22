import Image from "next/image";
import Link from "next/link";
import Reveal from "./Reveal";
import SectionWave from "./SectionWave";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate flex min-h-screen items-center overflow-hidden"
    >
      <Image
        src="/hero-bg.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-brown-900/95 via-brown-900/70 to-brown-900/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-brown-900/80 via-transparent to-transparent" />

      <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-28 md:pb-28 md:pt-36">
        <Reveal className="mx-auto max-w-xl text-center md:mx-0 md:text-left">
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-cream sm:text-5xl md:text-6xl lg:text-7xl">
            A mellow day,
            <br />
            every day.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-cream/80 md:mx-0 lg:max-w-lg lg:text-lg">
            Handcrafted milk tea, coffee, and specialty drinks — delivered
            fresh across Taguig City or ready for pickup, made slow, made
            fresh, one sip at a time.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            <Link
              href="/menu"
              className="rounded-full bg-cream px-7 py-3.5 text-sm font-bold text-brown-900 shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 lg:px-8 lg:py-4 lg:text-base"
            >
              Order Now
            </Link>
            <a
              href="#visit"
              className="rounded-full border-2 border-cream/60 px-7 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-cream/10 lg:px-8 lg:py-4 lg:text-base"
            >
              Contact Us
            </a>
          </div>
        </Reveal>
      </div>

      <SectionWave overlay fill="fill-cream" />
    </section>
  );
}
