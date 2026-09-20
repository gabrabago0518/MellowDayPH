import { Fragment } from "react";
import Image from "next/image";
import { getEffectiveStage, getStageLabel, getVisibleStages } from "@/lib/order-stage";
import type { OrderStage } from "@/lib/orders";

const STAGE_ICON: Record<OrderStage, string> = {
  confirmation: "/confirmation.webp",
  preparing: "/preparing.webp",
  out_for_delivery: "/out-for-delivery.webp",
  delivered: "/delivered.webp",
};

export default function OrderTracker({
  fulfillment,
  method,
  stage,
}: {
  fulfillment: "pickup" | "delivery";
  method: "gcash" | "cash";
  stage: OrderStage | null | undefined;
}) {
  const effectiveStage = getEffectiveStage(stage, method);
  const stages = getVisibleStages(method);
  const currentIndex = stages.indexOf(effectiveStage);

  return (
    <div>
      <div className="flex items-center">
        {stages.map((s, i) => (
          <Fragment key={s}>
            {i > 0 && (
              <div
                className={`h-0.5 flex-1 ${i <= currentIndex ? "bg-brown-900" : "bg-brown-900/15"}`}
              />
            )}
            <div
              className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 ${
                i <= currentIndex ? "border-brown-900 bg-brown-100/40" : "border-brown-900/15 bg-white"
              }`}
            >
              <Image
                src={STAGE_ICON[s]}
                alt={getStageLabel(fulfillment, s)}
                fill
                className={`rounded-full object-cover p-0.5 ${i <= currentIndex ? "" : "opacity-30 grayscale"}`}
                sizes="56px"
              />
            </div>
          </Fragment>
        ))}
      </div>
      <div className="mt-2 flex items-start">
        {stages.map((s, i) => (
          <Fragment key={s}>
            {i > 0 && <div className="flex-1" />}
            <div
              className={`w-14 shrink-0 text-center text-[11px] font-bold leading-tight ${
                i <= currentIndex ? "text-brown-900" : "text-brown-900/40"
              }`}
            >
              {getStageLabel(fulfillment, s)}
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
