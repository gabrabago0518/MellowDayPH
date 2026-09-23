export const MENU_CATEGORIES = [
  "Coffee",
  "Hot Drinks",
  "Signature Drinks",
  "Non Coffee",
  "Frappuccino",
  "Smoothie",
  "Refreshers",
  "Desserts",
  "Croffle",
  "Mellow Fries",
  "Mini Bungeoppang",
] as const;

export type MenuCategory = (typeof MENU_CATEGORIES)[number];

const FOOD_CATEGORIES: MenuCategory[] = [
  "Desserts",
  "Croffle",
  "Mellow Fries",
  "Mini Bungeoppang",
];

export function isFoodCategory(category: MenuCategory): boolean {
  return FOOD_CATEGORIES.includes(category);
}

export type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: MenuCategory;
  color: string;
  image?: string;
  description?: string;
};

// The menu itself now lives in the `menu_items` table (see
// src/lib/menu-items.ts for server-side reads/writes, and
// src/app/api/menu/route.ts for the public client-facing read) instead of
// a hardcoded array here — an admin can add a drink or change a price from
// the dashboard without a code change or redeploy. This file keeps just
// the category list and shared helpers/types that both server and client
// code need.

export function formatPrice(price: number): string {
  return `₱${price}`;
}
