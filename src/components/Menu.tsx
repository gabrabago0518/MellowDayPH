"use client";

import { useState } from "react";
import MenuCard from "./MenuCard";
import Reveal from "./Reveal";
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  isFoodCategory,
  type MenuCategory,
} from "@/lib/menu-data";

export default function Menu() {
  const [active, setActive] = useState<MenuCategory>(MENU_CATEGORIES[0]);
  const items = MENU_ITEMS.filter((item) => item.category === active);
  const foodCategory = isFoodCategory(active);

  return (
    <section id="menu" className="bg-green">
      <div className="mx-auto max-w-7xl px-6 py-28 md:py-32">
        <Reveal className="text-center md:text-left">
          <h2 className="font-heading text-3xl font-extrabold text-brown-900 sm:text-4xl lg:text-5xl">
            Menu
          </h2>
          <p className="mt-2 max-w-lg text-sm text-brown-900/80 md:mx-0">
            A little something for every mood — pick a category and find
            your next favorite.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-3 md:flex-wrap">
            {MENU_CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActive(category)}
                className={`shrink-0 px-5 pb-4 pt-3 text-sm font-bold transition-colors [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)] ${
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
            <MenuCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              color={item.color}
              image={item.image}
              description={item.description}
              isFood={foodCategory}
              delay={i * 60}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
