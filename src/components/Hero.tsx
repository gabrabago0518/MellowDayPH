import CupIllustration from "./CupIllustration";
import Reveal from "./Reveal";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-gradient-to-br from-brown-900 via-brown-800 to-brown-700"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-green/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col-reverse items-center gap-10 px-6 pb-20 pt-28 md:flex-row md:pb-28 md:pt-36">
        <Reveal className="flex-1 text-center md:text-left">
          <span className="inline-block rounded-full bg-cream/10 px-4 py-1.5 text-xs font-bold tracking-[0.2em] text-cream/90">
            MELLOW DAY PH
          </span>
          <h1 className="mt-5 font-heading text-4xl font-extrabold leading-tight text-cream sm:text-5xl md:text-6xl">
            A mellow day,
            <br />
            every day.
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-cream/80 md:mx-0">
            Handcrafted milk tea, coffee, and specialty drinks made slow,
            made fresh, and made to help you press pause — one sip at a
            time.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4 md:justify-start">
            <a
              href="#menu"
              className="rounded-full bg-cream px-7 py-3.5 text-sm font-bold text-brown-900 shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5"
            >
              Order Now
            </a>
            <a
              href="#visit"
              className="rounded-full border-2 border-cream/60 px-7 py-3.5 text-sm font-bold text-cream transition-colors hover:bg-cream/10"
            >
              Contact Us
            </a>
          </div>
        </Reveal>

        <Reveal delay={150} className="flex flex-1 justify-center">
          <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-cream/10 sm:h-80 sm:w-80">
            <div className="animate-float">
              <CupIllustration color="#F2B705" className="h-48 w-auto drop-shadow-2xl sm:h-64" />
            </div>
            <span className="animate-float-slow absolute -left-2 top-6 h-4 w-4 rounded-full bg-green/70" />
            <span className="animate-float absolute right-4 top-16 h-3 w-3 rounded-full bg-gold/80" />
            <span className="animate-float-slow absolute bottom-8 right-0 h-5 w-5 rounded-full bg-cream/40" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
