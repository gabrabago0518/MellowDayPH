import CupIllustration from "./CupIllustration";
import Reveal from "./Reveal";

const FEATURES = [
  "Freshly brewed daily",
  "Made-to-order, always",
  "Crafted with local ingredients",
];

export default function About() {
  return (
    <section id="about" className="bg-cream">
      <div className="mx-auto grid max-w-6xl gap-14 px-6 py-20 md:grid-cols-2 md:items-center md:py-28">
        <Reveal className="order-2 md:order-1">
          <div className="relative flex aspect-square items-center justify-center rounded-[2.5rem] bg-green/20">
            <div className="animate-float-slow flex gap-4">
              <CupIllustration color="#8A5A34" className="h-36 w-auto sm:h-44" />
              <CupIllustration color="#E77E8A" className="mt-10 h-32 w-auto sm:h-40" />
            </div>
            <span className="absolute left-6 top-8 rounded-full bg-cream px-4 py-1.5 text-xs font-bold text-brown-900 shadow-sm">
              Since day one 🍵
            </span>
          </div>
        </Reveal>

        <Reveal delay={150} className="order-1 md:order-2">
          <h2 className="font-heading text-3xl font-extrabold text-brown-900 sm:text-4xl">
            A mellow day, every day.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-brown-800/90">
            Mellow Day PH started with a simple idea: everyone deserves a
            little pause in their day. What began as a small milk tea stand
            has grown into a cozy spot where friends catch up, students
            study, and regulars know their order by heart. Every cup is
            made fresh, one drink at a time — because slowing down should
            taste this good.
          </p>
          <ul className="mt-6 space-y-3">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm font-semibold text-brown-900">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green text-white">
                  ✓
                </span>
                {feature}
              </li>
            ))}
          </ul>
          <a
            href="#menu"
            className="mt-8 inline-block rounded-full bg-brown-900 px-7 py-3.5 text-sm font-bold text-cream transition-transform hover:-translate-y-0.5 hover:bg-brown-800"
          >
            Order Now
          </a>
        </Reveal>
      </div>
    </section>
  );
}
