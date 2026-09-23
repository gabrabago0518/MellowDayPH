import { NextResponse } from "next/server";
import { getMenuItems } from "@/lib/menu-items";

// Public, unauthenticated, read-only — the menu is public information.
// Used by client components (cart, checkout, order history) that need to
// look up an item's image/color for display; pricing itself is never
// trusted from here (see order-pricing.ts, which reads the same table
// directly server-side for every order).
export async function GET() {
  const items = await getMenuItems();
  return NextResponse.json({ items });
}
