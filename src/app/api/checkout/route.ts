import { NextResponse } from "next/server";
import { MENU_ITEMS } from "@/lib/menu-data";
import { createGCashCheckout } from "@/lib/paymongo";

const MIN_AMOUNT_PESOS = 20;
export const DELIVERY_FEE_PESOS = 49;

type CheckoutRequestItem = { id: string; quantity: number };
type FulfillmentMethod = "pickup" | "delivery";

export async function POST(request: Request) {
  let body: {
    items?: CheckoutRequestItem[];
    customer?: { name?: string; phone?: string; email?: string };
    fulfillment?: {
      method?: FulfillmentMethod;
      street?: string;
      city?: string;
      barangay?: string;
      landmark?: string;
    };
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const items = body.items ?? [];
  const customer = body.customer ?? {};
  const fulfillment = body.fulfillment ?? {};

  if (items.length === 0) {
    return NextResponse.json({ error: "Your bag is empty" }, { status: 400 });
  }

  const name = customer.name?.trim();
  const phone = customer.phone?.trim();
  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and mobile number are required" },
      { status: 400 },
    );
  }

  const method: FulfillmentMethod = fulfillment.method === "delivery" ? "delivery" : "pickup";
  const street = fulfillment.street?.trim();
  const city = fulfillment.city?.trim();
  const barangay = fulfillment.barangay?.trim();
  const landmark = fulfillment.landmark?.trim();

  if (method === "delivery" && (!street || !city || !barangay)) {
    return NextResponse.json(
      { error: "Street, barangay, and city are required for delivery" },
      { status: 400 },
    );
  }

  // Recompute the total from the real menu data — never trust a client-sent price.
  let totalPesos = 0;
  const summaryLines: string[] = [];

  for (const line of items) {
    const menuItem = MENU_ITEMS.find((m) => m.id === line.id);
    const quantity = Math.floor(Number(line.quantity));

    if (!menuItem || !Number.isFinite(quantity) || quantity <= 0) {
      return NextResponse.json(
        { error: "Your bag contains an invalid item — please refresh and try again" },
        { status: 400 },
      );
    }

    totalPesos += menuItem.price * quantity;
    summaryLines.push(`${quantity}x ${menuItem.name}`);
  }

  // Flat delivery fee is added server-side — never trust a client-sent fee.
  if (method === "delivery") {
    totalPesos += DELIVERY_FEE_PESOS;
  }

  if (totalPesos < MIN_AMOUNT_PESOS) {
    return NextResponse.json(
      { error: `Minimum order for GCash payment is ₱${MIN_AMOUNT_PESOS}` },
      { status: 400 },
    );
  }

  const origin = new URL(request.url).origin;
  const summaryText =
    method === "delivery"
      ? `${summaryLines.join(", ")} + delivery (₱${DELIVERY_FEE_PESOS})`
      : summaryLines.join(", ");
  const orderSummary = summaryText.slice(0, 480);
  const deliveryAddress =
    method === "delivery"
      ? [street, barangay, city, landmark].filter(Boolean).join(", ")
      : "";

  try {
    const checkout = await createGCashCheckout({
      amountCentavos: Math.round(totalPesos * 100),
      description: `Mellow Day PH order for ${name}`,
      metadata: {
        order_summary: orderSummary,
        customer_name: name,
        customer_phone: phone,
        fulfillment_method: method,
        ...(deliveryAddress ? { delivery_address: deliveryAddress } : {}),
      },
      billing: { name, phone, email: customer.email?.trim() },
      returnUrl: `${origin}/checkout/return`,
    });

    return NextResponse.json(checkout);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Payment setup failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
