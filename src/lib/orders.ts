import { supabase } from "./supabase";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderStatus = "pending" | "paid" | "placed" | "failed";

export type Order = {
  id: string;
  createdAt: string;
  method: "gcash" | "cash";
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  fulfillment: "pickup" | "delivery";
  deliveryAddress?: string;
  name: string;
  phone: string;
};

const STORAGE_KEY = "mellowday-orders";

export function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function persist(orders: Order[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
  } catch {
    // localStorage unavailable (private mode, etc.) — order just won't be remembered.
  }
}

export function saveOrder(order: Order) {
  const orders = getOrders();
  const existingIndex = orders.findIndex((o) => o.id === order.id);
  if (existingIndex >= 0) {
    orders[existingIndex] = order;
  } else {
    orders.unshift(order);
  }
  persist(orders);
}

export function updateOrderStatus(id: string, status: OrderStatus) {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index >= 0) {
    orders[index] = { ...orders[index], status };
    persist(orders);
  }
}

// Signed-in customers get their orders stored in Supabase (see
// supabase/migrations/001_create_orders.sql) so history follows their
// account across devices. Guests keep using the localStorage functions
// above. Both are best-effort — a failed remote write never blocks checkout.

type OrderRow = {
  id: string;
  created_at: string;
  method: "gcash" | "cash";
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  fulfillment: "pickup" | "delivery";
  delivery_address: string | null;
  name: string;
  phone: string;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    createdAt: row.created_at,
    method: row.method,
    status: row.status,
    items: row.items,
    total: Number(row.total),
    fulfillment: row.fulfillment,
    deliveryAddress: row.delivery_address ?? undefined,
    name: row.name,
    phone: row.phone,
  };
}

export async function saveOrderRemote(order: Order, userId: string): Promise<void> {
  if (!supabase) return;
  await supabase.from("orders").upsert({
    id: order.id,
    user_id: userId,
    created_at: order.createdAt,
    method: order.method,
    status: order.status,
    items: order.items,
    total: order.total,
    fulfillment: order.fulfillment,
    delivery_address: order.deliveryAddress ?? null,
    name: order.name,
    phone: order.phone,
  });
}

export async function updateOrderStatusRemote(id: string, status: OrderStatus): Promise<void> {
  if (!supabase) return;
  await supabase.from("orders").update({ status }).eq("id", id);
}

export async function getOrdersRemote(userId: string): Promise<Order[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) return [];
  return (data as OrderRow[]).map(rowToOrder);
}
