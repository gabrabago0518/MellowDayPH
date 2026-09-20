import { supabase } from "./supabase";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderStatus = "pending" | "paid" | "placed" | "failed";

// Fulfillment progress, separate from payment status — tracked once an
// order is confirmed (paid or placed for cash-on-pickup/delivery). Null
// means tracking hasn't started yet (e.g. a GCash order still pending).
export type OrderStage = "confirmation" | "preparing" | "out_for_delivery" | "delivered";

// When each stage was actually reached (ISO timestamps), so the tracker can
// show a per-step time rather than just the current stage.
export type StageHistory = Partial<Record<OrderStage, string>>;

export type Order = {
  id: string;
  createdAt: string;
  method: "gcash" | "cash";
  status: OrderStatus;
  stage?: OrderStage | null;
  stageHistory?: StageHistory;
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

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
  stage?: OrderStage,
  stageHistory?: StageHistory,
) {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index >= 0) {
    orders[index] = {
      ...orders[index],
      status,
      ...(stage ? { stage } : {}),
      ...(stageHistory ? { stageHistory } : {}),
    };
    persist(orders);
  }
}

export function updateOrderStage(id: string, stage: OrderStage, stageHistory: StageHistory) {
  const orders = getOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index >= 0) {
    orders[index] = { ...orders[index], stage, stageHistory };
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
  stage: OrderStage | null;
  stage_history: StageHistory | null;
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
    stage: row.stage,
    stageHistory: row.stage_history ?? undefined,
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
    stage: order.stage ?? null,
    stage_history: order.stageHistory ?? {},
    items: order.items,
    total: order.total,
    fulfillment: order.fulfillment,
    delivery_address: order.deliveryAddress ?? null,
    name: order.name,
    phone: order.phone,
  });
}

export async function updateOrderStatusRemote(
  id: string,
  status: OrderStatus,
  stage?: OrderStage,
  stageHistory?: StageHistory,
): Promise<void> {
  if (!supabase) return;
  await supabase
    .from("orders")
    .update({
      status,
      ...(stage ? { stage } : {}),
      ...(stageHistory ? { stage_history: stageHistory } : {}),
    })
    .eq("id", id);
}

export async function updateOrderStageRemote(
  id: string,
  stage: OrderStage,
  stageHistory: StageHistory,
): Promise<void> {
  if (!supabase) return;
  await supabase.from("orders").update({ stage, stage_history: stageHistory }).eq("id", id);
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
