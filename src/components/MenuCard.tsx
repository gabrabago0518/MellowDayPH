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
  description,
  isFood,
  delay,
}: {
  id: string;
  name: string;
  price: number;
  color: string;
  image?: string;
  description?: string;
  isFood: boolean;
  delay: number;
}) {
  const { items, addItem, updateQuantity } = useCart();
  const inCart = items.find((item) => item.id === id);
  const Illustration = isFood ? FoodIllustration : CupIllustration;

  return (
    <Reveal delay={delay}>
      <div className="group flex h-full flex-col rounded-3xl bg-brown-100 p-4 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
        <div className="relative mx-auto h-32 w-32 shrink-0 transition-transform duration-300 group-hover:scale-105 sm:h-36 sm:w-36">
          {image ? (
            <Image src={image} alt={name} fill className="object-contain" />
          ) : (
            <Illustration color={color} className="h-full w-auto" />
          )}
        </div>

        <h3 className="font-subheading mt-3 text-base font-bold text-brown-900">{name}</h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-brown-900/60">
            {description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-base font-bold text-brown-900">{formatPrice(price)}</span>

          {inCart ? (
            <div className="flex items-center gap-2 rounded-full bg-cream px-2 py-1.5">
              <button
                type="button"
                aria-label={`Decrease quantity of ${name}`}
                onClick={() => updateQuantity(id, inCart.quantity - 1)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-brown-900 hover:bg-brown-100"
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
                className="flex h-6 w-6 items-center justify-center rounded-full text-brown-900 hover:bg-brown-100"
              >
                <IconPlus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label={`Add ${name} to cart`}
              onClick={() => addItem(id, name, price)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brown-900 text-cream transition-transform hover:scale-105 hover:bg-brown-800"
            >
              <IconPlus className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </Reveal>
  );
}
