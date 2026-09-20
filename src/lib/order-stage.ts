import type { OrderStage } from "./orders";

const ALL_STAGES: OrderStage[] = ["confirmation", "preparing", "out_for_delivery", "delivered"];

// GCash orders skip the "Confirmation" step entirely — payment already
// confirms the order, so tracking starts at "Preparing".
export function getVisibleStages(method: "gcash" | "cash"): OrderStage[] {
  return method === "cash" ? ALL_STAGES : ALL_STAGES.filter((s) => s !== "confirmation");
}

export function getStageLabel(fulfillment: "pickup" | "delivery", stage: OrderStage): string {
  if (fulfillment === "pickup") {
    if (stage === "out_for_delivery") return "Ready to Pick Up";
    if (stage === "delivered") return "Completed";
  }
  switch (stage) {
    case "confirmation":
      return "Confirmed";
    case "preparing":
      return "Preparing";
    case "out_for_delivery":
      return "Out for Delivery";
    case "delivered":
      return "Delivered";
  }
}

// Orders placed before stage tracking existed — or a GCash order that just
// got marked paid — may have no stage recorded yet. Treat them as freshly
// at the first stage that applies to how they were paid for, rather than
// showing nothing.
export function getEffectiveStage(
  stage: OrderStage | null | undefined,
  method: "gcash" | "cash",
): OrderStage {
  if (stage) return stage;
  return method === "cash" ? "confirmation" : "preparing";
}

export function getNextStage(stage: OrderStage, method: "gcash" | "cash"): OrderStage | null {
  const stages = getVisibleStages(method);
  const index = stages.indexOf(stage);
  if (index === -1 || index === stages.length - 1) return null;
  return stages[index + 1];
}

// Always Philippines local time regardless of the viewer's own device/browser
// timezone — the store operates in the Philippines, so a step's timestamp
// should read the same for everyone looking at it.
export function formatStageTime(iso: string): string {
  return new Date(iso).toLocaleString("en-PH", {
    timeZone: "Asia/Manila",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
