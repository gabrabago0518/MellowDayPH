import "server-only";
import { getDeliveryFeeForCity } from "./delivery-fee";
import { getMenuItemsByIds } from "./menu-items";

export const MIN_AMOUNT_PESOS = 20;
// Sanity caps — not real business limits, just guards against a client
// sending a garbage/malicious quantity that wastes a PayMongo API call or
// produces a nonsensical total.
export const MAX_ITEM_QUANTITY = 50;
export const MAX_ORDER_TOTAL_PESOS = 50_000;
const MAX_SPECIAL_INSTRUCTIONS_LENGTH = 480;

export type FulfillmentMethod = "pickup" | "delivery";

export type OrderPricingInput = {
  items?: { id?: unknown; quantity?: unknown }[];
  customer?: { name?: string; phone?: string; email?: string };
  fulfillment?: {
    method?: FulfillmentMethod;
    street?: string;
    city?: string;
    barangay?: string;
    landmark?: string;
  };
  specialInstructions?: string;
};

export type OrderPricingResult = {
  name: string;
  phone: string;
  email: string;
  method: FulfillmentMethod;
  deliveryAddress?: string;
  items: { id: string; name: string; price: number; quantity: number }[];
  deliveryFeePesos: number;
  totalPesos: number;
  orderSummary: string;
  specialInstructions?: string;
};

export type OrderPricingError = { error: string; status: number };

// Shared by every order-creation route (GCash checkout, cash orders) so
// price/validation logic lives in exactly one place and both payment
// methods stay consistent — never trust a client-sent price or item list.
// Async because menu items now live in the database (see menu-items.ts)
// instead of a hardcoded in-memory array.
export async function computeOrderPricing(
  body: OrderPricingInput,
): Promise<OrderPricingResult | OrderPricingError> {
  // A body that parses as valid JSON but isn't an object (e.g. a bare
  // `null`, number, or string) would otherwise crash on the very next
  // property access below instead of returning a clean 400.
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body", status: 400 };
  }

  // Normalize anything that isn't actually an array (object, string,
  // number, null/undefined) to empty rather than risk a non-iterable value
  // reaching the for...of loop below.
  const rawItems = Array.isArray(body.items) ? body.items : [];
  if (rawItems.length === 0) {
    return { error: "Your bag is empty", status: 400 };
  }

  const customer = body.customer ?? {};
  const name = customer.name?.trim();
  const phone = customer.phone?.trim();
  if (!name || !phone) {
    return { error: "Name and mobile number are required", status: 400 };
  }

  const fulfillment = body.fulfillment ?? {};
  const method: FulfillmentMethod = fulfillment.method === "delivery" ? "delivery" : "pickup";
  const street = fulfillment.street?.trim();
  const city = fulfillment.city?.trim();
  const barangay = fulfillment.barangay?.trim();
  const landmark = fulfillment.landmark?.trim();

  if (method === "delivery" && (!street || !city || !barangay)) {
    return { error: "Street, barangay, and city are required for delivery", status: 400 };
  }

  // Merge duplicate lines for the same item (e.g. sent twice in one
  // request) into a single combined quantity before pricing/capping it.
  const mergedQuantities = new Map<string, number>();
  for (const line of rawItems) {
    const quantity = Math.floor(Number(line?.quantity));
    if (typeof line?.id !== "string" || !Number.isFinite(quantity) || quantity <= 0) {
      return { error: "Your bag contains an invalid item — please refresh and try again", status: 400 };
    }
    mergedQuantities.set(line.id, (mergedQuantities.get(line.id) ?? 0) + quantity);
  }

  // One query for every distinct item the order references, rather than
  // one query per item — a bag with 5 different drinks is still a single
  // round trip.
  const menuItemsById = new Map(
    (await getMenuItemsByIds([...mergedQuantities.keys()])).map((item) => [item.id, item]),
  );

  let itemsTotalPesos = 0;
  const items: OrderPricingResult["items"] = [];
  const summaryLines: string[] = [];

  for (const [id, quantity] of mergedQuantities) {
    const menuItem = menuItemsById.get(id);
    if (!menuItem) {
      return { error: "Your bag contains an invalid item — please refresh and try again", status: 400 };
    }
    if (!menuItem.available) {
      return { error: `${menuItem.name} is currently unavailable — please remove it from your bag.`, status: 400 };
    }
    if (quantity > MAX_ITEM_QUANTITY) {
      return {
        error: `You can order at most ${MAX_ITEM_QUANTITY} of a single item at a time.`,
        status: 400,
      };
    }
    itemsTotalPesos += menuItem.price * quantity;
    items.push({ id: menuItem.id, name: menuItem.name, price: menuItem.price, quantity });
    summaryLines.push(`${quantity}x ${menuItem.name}`);
  }

  const deliveryFeePesos = method === "delivery" ? getDeliveryFeeForCity(city) : 0;
  const totalPesos = itemsTotalPesos + deliveryFeePesos;

  if (totalPesos > MAX_ORDER_TOTAL_PESOS) {
    return {
      error: "This order is too large to place online — please contact the store directly.",
      status: 400,
    };
  }

  const deliveryAddress =
    method === "delivery" ? [street, barangay, city, landmark].filter(Boolean).join(", ") : undefined;

  const orderSummary = (
    method === "delivery"
      ? `${summaryLines.join(", ")} + delivery (₱${deliveryFeePesos})`
      : summaryLines.join(", ")
  ).slice(0, 480);

  const specialInstructions =
    body.specialInstructions?.trim().slice(0, MAX_SPECIAL_INSTRUCTIONS_LENGTH) || undefined;

  return {
    name,
    phone,
    email: customer.email?.trim() || "",
    method,
    deliveryAddress,
    items,
    deliveryFeePesos,
    totalPesos,
    orderSummary,
    specialInstructions,
  };
}
