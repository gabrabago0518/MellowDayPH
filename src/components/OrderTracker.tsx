import { Fragment } from "react";
import Logo from "./Logo";
import { getEffectiveStage, getStageLabel, getVisibleStages } from "@/lib/order-stage";
import type { OrderStage } from "@/lib/orders";

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
              className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full border-2 ${
                i <= currentIndex ? "border-brown-900 bg-brown-900" : "border-brown-900/15 bg-white"
              }`}
            >
              <Logo className={`h-8 w-8 ${i <= currentIndex ? "" : "opacity-30 grayscale"}`} />
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
