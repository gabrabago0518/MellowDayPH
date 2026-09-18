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
