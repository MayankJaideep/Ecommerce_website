import { delivery } from "./config";

export type Totals = { subtotal: number; shippingFee: number; total: number };

// Single source of truth for order math. The server always recomputes this;
// the amount sent by the browser is never trusted.
export function computeTotals(unitPrice: number, quantity: number): Totals {
  const subtotal = unitPrice * quantity;
  const shippingFee = delivery.fee;
  return { subtotal, shippingFee, total: subtotal + shippingFee };
}

export function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
