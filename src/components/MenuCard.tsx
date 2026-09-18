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
      <div className="group flex h-full flex-col rounded-2xl bg-[#F9F6EF] p-3 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl sm:rounded-[28px] sm:p-4">
        <div className="relative h-28 overflow-hidden rounded-2xl bg-[#D3CBB7] sm:h-44 sm:rounded-[21px]">
          <div className="absolute inset-0 flex items-center justify-center p-3">
            {image ? (
              <div className="relative h-[85%] w-[58%] transition-transform duration-300 group-hover:scale-105">
                <Image src={image} alt={name} fill className="object-contain" />
              </div>
            ) : (
              <Illustration
                color={color}
                className="h-[85%] w-auto transition-transform duration-300 group-hover:scale-105"
              />
            )}
          </div>
        </div>

        <h3 className="font-subheading mt-2.5 text-sm font-medium leading-tight text-[#5C341A] sm:mt-4 sm:text-[22px]">
          {name}
        </h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-[10px] leading-relaxed text-[#5C341A]/70 sm:text-[11px]">
            {description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-2.5 sm:pt-4">
          <span className="text-sm font-bold text-[#5C341A] sm:text-2xl">{formatPrice(price)}</span>

          {inCart ? (
            <div className="flex h-8 items-center gap-1 rounded-full bg-[#D3CBB7]/60 px-1.5 sm:h-11 sm:gap-2 sm:px-2">
              <button
                type="button"
                aria-label={`Decrease quantity of ${name}`}
                onClick={() => updateQuantity(id, inCart.quantity - 1)}
                className="flex h-5 w-5 items-center justify-center rounded-full text-[#5C341A] hover:bg-[#F9F6EF] sm:h-7 sm:w-7"
              >
                <IconMinus className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
              </button>
              <span className="w-3 text-center text-xs font-semibold text-[#5C341A] sm:w-4 sm:text-sm">
                {inCart.quantity}
              </span>
              <button
                type="button"
                aria-label={`Increase quantity of ${name}`}
                onClick={() => addItem(id, name, price)}
                className="flex h-5 w-5 items-center justify-center rounded-full text-[#5C341A] hover:bg-[#F9F6EF] sm:h-7 sm:w-7"
              >
                <IconPlus className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label={`Add ${name} to cart`}
              onClick={() => addItem(id, name, price)}
              className="flex h-8 w-14 shrink-0 items-center justify-center rounded-full bg-[#5C341A] text-[#F9F6EF] transition-transform hover:scale-105 sm:h-11 sm:w-20"
            >
              <IconPlus className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
            </button>
          )}
        </div>
      </div>
    </Reveal>
  );
}
