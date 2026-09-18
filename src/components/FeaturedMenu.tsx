"use client";

import { useState } from "react";
import Link from "next/link";
import MenuCard from "./MenuCard";
import Reveal from "./Reveal";
import { IconArrowRight } from "./icons";
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  isFoodCategory,
  type MenuCategory,
} from "@/lib/menu-data";

const FEATURED_PER_CATEGORY = 4;

export default function FeaturedMenu() {
  const [active, setActive] = useState<MenuCategory>(MENU_CATEGORIES[0]);
  const items = MENU_ITEMS.filter((item) => item.category === active).slice(
    0,
    FEATURED_PER_CATEGORY,
  );
  const foodCategory = isFoodCategory(active);

  return (
    <section id="menu" className="bg-green">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:py-32">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div className="text-center md:text-left">
            <h2 className="font-heading text-3xl font-extrabold text-brown-900 sm:text-4xl lg:text-5xl">
              Fan Favorites
            </h2>
            <p className="mt-2 max-w-lg text-sm text-brown-900/80">
              Our most-ordered drinks — pick a category for a taste.
            </p>
          </div>
          <Link
            href="/menu"
            className="hidden items-center gap-1.5 text-sm font-bold text-brown-900 transition-colors hover:text-brown-700 sm:flex"
          >
            View full menu
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        <Reveal delay={100}>
          <div className="mt-8 flex gap-2 overflow-x-auto pb-3 md:flex-wrap">
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

        <Reveal delay={150} className="mt-10 text-center">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-full bg-brown-900 px-8 py-4 text-base font-bold text-cream shadow-lg shadow-brown-900/20 transition-transform hover:-translate-y-0.5 hover:bg-brown-800"
          >
            See the Full Menu
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
