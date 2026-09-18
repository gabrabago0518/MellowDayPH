"use client";

import Image from "next/image";
import CupIllustration from "./CupIllustration";
import FoodIllustration from "./FoodIllustration";
import Reveal from "./Reveal";
import { IconMinus, IconPlus } from "./icons";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/menu-data";

export default function MenuCard({
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
