import type { OrderStatus } from "./orders";

export const STATUS_LABEL: Record<OrderStatus, string> = {
  paid: "Paid",
  placed: "Placed (Cash)",
  pending: "Pending",
  failed: "Failed",
};

export const STATUS_STYLE: Record<OrderStatus, string> = {
  paid: "bg-green/40 text-brown-900",
  placed: "bg-green/40 text-brown-900",
  pending: "bg-gold/30 text-brown-900",
  failed: "bg-red-100 text-red-700",
};

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
