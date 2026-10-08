import { isOrderStatus, STATUS_LABELS, type OrderStatus } from "@/lib/orders";

const STYLES: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-chilli/10 text-chilli ring-chilli/20",
  PAYMENT_VERIFICATION: "bg-lime/15 text-[#8a5a0b] ring-lime/30",
  CONFIRMED: "bg-tomato/10 text-tomato ring-tomato/20",
  PREPARING: "bg-coffee/10 text-coffee ring-coffee/20",
  SHIPPED: "bg-sky-100 text-sky-800 ring-sky-200",
  DELIVERED: "bg-tomato text-cream ring-tomato",
  CANCELLED: "bg-stone-200 text-stone-600 ring-stone-300",
};

export function StatusBadge({ status }: { status: string }) {
  const s = isOrderStatus(status) ? status : "PAYMENT_VERIFICATION";
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${STYLES[s]}`}>
      {STATUS_LABELS[s]}
    </span>
  );
}
