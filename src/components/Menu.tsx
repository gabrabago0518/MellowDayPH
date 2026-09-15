"use client";

import { useState } from "react";
import CupIllustration from "./CupIllustration";
import Reveal from "./Reveal";
import { MENU_CATEGORIES, MENU_ITEMS, type MenuCategory } from "@/lib/menu-data";

export default function Menu() {
  const [active, setActive] = useState<MenuCategory>(MENU_CATEGORIES[0]);
  const items = MENU_ITEMS.filter((item) => item.category === active);

  return (
    <section id="menu" className="bg-green">
      <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
        <Reveal className="text-center md:text-left">
          <h2 className="font-heading text-3xl font-extrabold text-brown-900 sm:text-4xl">
            Menu
          </h2>
          <p className="mt-2 max-w-lg text-sm text-brown-900/80 md:mx-0">
            A little something for every mood — pick a category and find
            your next favorite.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 flex gap-3 overflow-x-auto pb-2 md:flex-wrap">
            {MENU_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${
                  active === category
                    ? "bg-brown-900 text-cream"
                    : "bg-cream/70 text-brown-900 hover:bg-cream"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </Reveal>

        <div key={active} className="animate-fade-in mt-10 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.name} delay={i * 60}>
              <div className="group flex h-full flex-col items-center rounded-2xl bg-cream p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
                <CupIllustration
                  color={item.color}
                  className="h-24 w-auto transition-transform duration-300 group-hover:scale-105 sm:h-28"
                />
                <h3 className="mt-4 text-sm font-bold text-brown-900">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm font-semibold text-brown-700/80">
                  {item.price}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
