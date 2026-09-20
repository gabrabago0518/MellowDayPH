import type { OrderItem, OrderStage, OrderStatus, StageHistory } from "./orders";

export type AdminOrderRow = {
  id: string;
  user_id: string;
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

export type AdminAccount = {
  id: string;
  email: string | undefined;
  fullName: string;
  createdAt: string;
};

export type AdminOverview = {
  orders: AdminOrderRow[];
  accounts: AdminAccount[];
  stats: {
    totalOrders: number;
    totalAccounts: number;
    revenue: number;
    statusCounts: Record<OrderStatus, number>;
    dtd: { orders: number; revenue: number };
    mtd: { orders: number; revenue: number };
    mostSoldProduct: { name: string; quantity: number } | null;
  };
};

export type Employee = {
  id: string;
  full_name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  created_at: string;
};

export type Admin = {
  id: string;
  username: string;
  full_name: string | null;
  created_at: string;
};
