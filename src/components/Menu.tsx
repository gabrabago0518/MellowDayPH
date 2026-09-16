"use client";

import { useState } from "react";
import Image from "next/image";
import CupIllustration from "./CupIllustration";
import FoodIllustration from "./FoodIllustration";
import Reveal from "./Reveal";
import { IconMinus, IconPlus } from "./icons";
import { useCart } from "@/lib/CartContext";
import {
  MENU_CATEGORIES,
  MENU_ITEMS,
  formatPrice,
  isFoodCategory,
  type MenuCategory,
} from "@/lib/menu-data";

function MenuCard({
  id,
  name,
  price,
  color,
  image,
  isFood,
  delay,
}: {
  id: string;
  name: string;
  price: number;
  color: string;
  image?: string;
  isFood: boolean;
  delay: number;
}) {
  const { items, addItem, updateQuantity } = useCart();
  const inCart = items.find((item) => item.id === id);
  const Illustration = isFood ? FoodIllustration : CupIllustration;

  return (
    <Reveal delay={delay}>
      <div className="group flex h-full flex-col items-center rounded-2xl bg-cream p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
        {image ? (
          <div className="relative h-24 w-24 transition-transform duration-300 group-hover:scale-105 sm:h-28 sm:w-28">
            <Image src={image} alt={name} fill className="object-contain" />
          </div>
        ) : (
          <Illustration
            color={color}
            className="h-24 w-auto transition-transform duration-300 group-hover:scale-105 sm:h-28"
          />
        )}
        <h3 className="font-subheading mt-4 text-sm font-bold text-brown-900">{name}</h3>
        <p className="mt-1 text-sm font-semibold text-brown-700/80">
          {formatPrice(price)}
        </p>

        {inCart ? (
          <div className="mt-3 flex items-center gap-3 rounded-full bg-brown-100/60 px-2 py-1">
            <button
              type="button"
              aria-label={`Decrease quantity of ${name}`}
              onClick={() => updateQuantity(id, inCart.quantity - 1)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-brown-900 hover:bg-cream"
            >
              <IconMinus className="h-3.5 w-3.5" />
            </button>
            <span className="w-4 text-center text-sm font-semibold text-brown-900">
              {inCart.quantity}
            </span>
            <button
              type="button"
              aria-label={`Increase quantity of ${name}`}
              onClick={() => addItem(id, name, price)}
              className="flex h-6 w-6 items-center justify-center rounded-full text-brown-900 hover:bg-cream"
            >
              <IconPlus className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => addItem(id, name, price)}
            className="mt-3 rounded-full bg-brown-900 px-4 py-2 text-xs font-bold text-cream transition-colors hover:bg-brown-800"
          >
            Add to Cart
          </button>
        )}
      </div>
    </Reveal>
  );
}

export default function Menu() {
  const [active, setActive] = useState<MenuCategory>(MENU_CATEGORIES[0]);
  const items = MENU_ITEMS.filter((item) => item.category === active);
  const foodCategory = isFoodCategory(active);

  return (
    <section id="menu" className="bg-green">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:py-32">
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
            <MenuCard
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
              color={item.color}
              image={item.image}
              isFood={foodCategory}
              delay={i * 60}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
