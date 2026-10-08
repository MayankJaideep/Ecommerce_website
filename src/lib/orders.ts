export const ORDER_STATUSES = [
  "PENDING_PAYMENT",
  "PAYMENT_VERIFICATION",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "Pending Payment",
  PAYMENT_VERIFICATION: "Payment Verification",
  CONFIRMED: "Confirmed",
  PREPARING: "Preparing",
  SHIPPED: "Shipped",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const STATUS_DESCRIPTIONS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "We couldn't match your payment yet. We'll reach out on WhatsApp.",
  PAYMENT_VERIFICATION: "We received your screenshot and are verifying the payment.",
  CONFIRMED: "Payment verified — your order is confirmed!",
  PREPARING: "Your Hurlikattu is being freshly roasted and packed.",
  SHIPPED: "Your parcel is on its way.",
  DELIVERED: "Delivered. We hope it tastes like home!",
  CANCELLED: "This order was cancelled. Message us on WhatsApp for help.",
};

// Steps shown on the customer progress timeline, in order.
export const TIMELINE: OrderStatus[] = [
  "PAYMENT_VERIFICATION",
  "CONFIRMED",
  "PREPARING",
  "SHIPPED",
  "DELIVERED",
];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

// Unambiguous alphabet (no 0/O/1/I) so customers can read IDs over the phone.
// 32 symbols divides 256 evenly, so there is no modulo bias.
const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

export function generateOrderCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const body = Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `HK-${body.slice(0, 4)}-${body.slice(4)}`;
}

export const ORDER_CODE_PATTERN = /^HK-[2-9A-HJ-NP-Z]{4}-[2-9A-HJ-NP-Z]{4}$/;

export function normalizeOrderCode(input: string) {
  const raw = input.toUpperCase().replace(/[^0-9A-Z]/g, "");
  const body = raw.startsWith("HK") ? raw.slice(2) : raw;
  return body.length === 8 ? `HK-${body.slice(0, 4)}-${body.slice(4)}` : input.trim().toUpperCase();
}
