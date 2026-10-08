"use client";

import { delivery } from "@/lib/config";
import { MinusIcon, PlusIcon } from "./Icons";

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  size = "md",
}: {
  value: number;
  onChange: (q: number) => void;
  min?: number;
  size?: "md" | "sm";
}) {
  const btn = size === "md" ? "h-12 w-12" : "h-10 w-10";
  return (
    <div className="inline-flex items-center rounded-full bg-white ring-1 ring-coffee/15">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label="Decrease quantity"
        className={`${btn} flex items-center justify-center rounded-full text-bark hover:bg-paper disabled:opacity-30`}
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span
        className={`${size === "md" ? "w-10 text-lg" : "w-8"} text-center font-bold tabular-nums`}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= delivery.maxQtyPerOrder}
        aria-label="Increase quantity"
        className={`${btn} flex items-center justify-center rounded-full text-bark hover:bg-paper disabled:opacity-30`}
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
