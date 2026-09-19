import type { OrderItem, OrderStatus } from "./orders";

export type AdminOrderRow = {
  id: string;
  user_id: string;
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
