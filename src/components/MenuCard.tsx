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
      <div className="group flex h-full flex-col rounded-[28px] bg-[#F9F6EF] p-4 shadow-sm ring-1 ring-black/5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl">
        <div className="relative h-40 overflow-hidden rounded-[21px] bg-[#D3CBB7] sm:h-44">
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

        <h3 className="font-subheading mt-4 text-[22px] font-medium leading-tight text-[#5C341A]">
          {name}
        </h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-[#5C341A]/70">
            {description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-2xl font-bold text-[#5C341A]">{formatPrice(price)}</span>

          {inCart ? (
            <div className="flex h-11 items-center gap-2 rounded-full bg-[#D3CBB7]/60 px-2">
              <button
                type="button"
                aria-label={`Decrease quantity of ${name}`}
                onClick={() => updateQuantity(id, inCart.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#5C341A] hover:bg-[#F9F6EF]"
              >
                <IconMinus className="h-3.5 w-3.5" />
              </button>
              <span className="w-4 text-center text-sm font-semibold text-[#5C341A]">
                {inCart.quantity}
              </span>
              <button
                type="button"
                aria-label={`Increase quantity of ${name}`}
                onClick={() => addItem(id, name, price)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[#5C341A] hover:bg-[#F9F6EF]"
              >
                <IconPlus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              aria-label={`Add ${name} to cart`}
              onClick={() => addItem(id, name, price)}
              className="flex h-11 w-20 shrink-0 items-center justify-center rounded-full bg-[#5C341A] text-[#F9F6EF] transition-transform hover:scale-105"
            >
              <IconPlus className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>
    </Reveal>
  );
}
