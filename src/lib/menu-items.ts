import "server-only";
import { getSupabaseAdmin, isAdminConfigured } from "./supabase-admin";
import type { MenuItem } from "./menu-data";

const MENU_ITEM_COLUMNS = "id, name, price, category, color, image, description, available, sort_order";

type MenuItemRow = MenuItem & { available: boolean; sort_order: number };

// Every public-facing read (the /menu page, the homepage's Fan Favorites,
// the public /api/menu route) goes through this — the menu now lives in
// the database instead of a hardcoded array, so an admin can add a drink
// or change a price without a code change or redeploy.
export async function getMenuItems(): Promise<MenuItemRow[]> {
  if (!isAdminConfigured) return [];
  const { data, error } = await getSupabaseAdmin()
    .from("menu_items")
    .select(MENU_ITEM_COLUMNS)
    .eq("available", true)
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}

// Used by order-pricing.ts — looks up exactly the item ids an order
// references (never a client-supplied price/name), so a fabricated or
// stale price in the request body can't be trusted. Includes unavailable
// items too, deliberately: computeOrderPricing decides what to do with a
// sold-out item, this just fetches the truth.
export async function getMenuItemsByIds(ids: string[]): Promise<MenuItemRow[]> {
  if (!isAdminConfigured || ids.length === 0) return [];
  const { data, error } = await getSupabaseAdmin()
    .from("menu_items")
    .select(MENU_ITEM_COLUMNS)
    .in("id", ids);
  if (error) throw new Error(error.message);
  return data ?? [];
}

// Admin dashboard only — includes unavailable items so they can still be
// managed (re-enabled, edited, deleted) from the Menu tab.
export async function getAllMenuItemsForAdmin(): Promise<MenuItemRow[]> {
  if (!isAdminConfigured) return [];
  const { data, error } = await getSupabaseAdmin()
    .from("menu_items")
    .select(MENU_ITEM_COLUMNS)
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });
  if (error) throw new Error(error.message);
  return data ?? [];
}
