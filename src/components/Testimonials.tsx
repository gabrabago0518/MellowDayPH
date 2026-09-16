"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { IconChevronLeft, IconChevronRight, IconStar } from "./icons";
import { TESTIMONIALS } from "@/lib/testimonials-data";

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const count = TESTIMONIALS.length;

  const next = () => setIndex((i) => (i + 1) % count);
  const prev = () => setIndex((i) => (i - 1 + count) % count);
  const visible = [0, 1, 2].map((offset) => TESTIMONIALS[(index + offset) % count]);

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:py-32">
        <Reveal>
          <h2 className="text-center font-heading text-3xl font-extrabold text-brown-900 sm:text-4xl lg:text-5xl">
            What Our Fans Say
          </h2>
        </Reveal>

        <div className="mt-12 flex items-center gap-4">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green/30 text-brown-900 transition-colors hover:bg-green/50 sm:flex"
          >
            <IconChevronLeft className="h-5 w-5" />
          </button>

          <div key={index} className="animate-fade-in grid flex-1 gap-6 sm:grid-cols-3">
            {visible.map((t, i) => (
              <div
                key={`${t.name}-${i}`}
                className={`rounded-3xl bg-green/25 p-6 transition-all ${
                  i === 0 ? "" : "hidden sm:block"
                }`}
              >
                <div className="flex gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <IconStar key={star} className="h-4 w-4" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-brown-900/90">
                  {t.quote}
                </p>
                <p className="font-subheading mt-4 text-sm font-bold text-brown-900">
                  {t.name}
                </p>
                <p className="text-xs text-brown-900/60">{t.role}</p>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green/30 text-brown-900 transition-colors hover:bg-green/50 sm:flex"
          >
            <IconChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-4 sm:hidden">
          <button type="button" onClick={prev} aria-label="Previous testimonial" className="text-brown-900">
            <IconChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {TESTIMONIALS.map((t, i) => (
              <span
                key={t.name}
                className={`h-2 w-2 rounded-full transition-colors ${
                  i === index ? "bg-brown-900" : "bg-brown-900/25"
                }`}
              />
            ))}
          </div>
          <button type="button" onClick={next} aria-label="Next testimonial" className="text-brown-900">
            <IconChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 hidden justify-center gap-2 sm:flex">
          {TESTIMONIALS.map((t, i) => (
            <button
              key={t.name}
              type="button"
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-brown-900" : "w-2 bg-brown-900/25"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
