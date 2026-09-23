"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { MenuItem } from "./menu-data";

type MenuDataContextValue = {
  items: MenuItem[];
  getItem: (id: string) => MenuItem | undefined;
};

const MenuDataContext = createContext<MenuDataContextValue | null>(null);

// Fetches the menu once (from the public /api/menu route) and shares it
// through context, so CartModal/checkout/orders can look up an item's
// image/color for display without each holding its own copy of a
// hardcoded array — the menu now lives in the database and can change at
// any time from the admin dashboard.
export function MenuDataProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/menu")
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((body) => {
        if (!cancelled) setItems(body.items ?? []);
      })
      .catch(() => {
        // These lookups are decorative only (image/color for an item
        // that's already in the cart by id/name/price) — a failed fetch
        // just means those rows fall back to a generic illustration.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const byId = useMemo(() => new Map(items.map((item) => [item.id, item])), [items]);

  const value = useMemo<MenuDataContextValue>(
    () => ({ items, getItem: (id: string) => byId.get(id) }),
    [items, byId],
  );

  return <MenuDataContext.Provider value={value}>{children}</MenuDataContext.Provider>;
}

export function useMenuData(): MenuDataContextValue {
  const ctx = useContext(MenuDataContext);
  if (!ctx) {
    throw new Error("useMenuData must be used within a MenuDataProvider");
  }
  return ctx;
}
