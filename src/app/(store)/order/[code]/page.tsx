import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { prisma } from "@/lib/db";
import { brand, delivery, whatsappLink } from "@/lib/config";
import { formatINR } from "@/lib/pricing";
import { getProduct } from "@/lib/product";
import {
  isOrderStatus,
  normalizeOrderCode,
  ORDER_CODE_PATTERN,
  STATUS_DESCRIPTIONS,
  STATUS_LABELS,
  TIMELINE,
} from "@/lib/orders";
import { StatusBadge } from "@/components/StatusBadge";
import { CheckIcon, WhatsAppIcon } from "@/components/Icons";
import { CopyButton } from "@/components/CopyButton";

export const metadata: Metadata = {
  title: "Your order",
  robots: { index: false },
};

export default function OrderPage({ params, searchParams }: PageProps<"/order/[code]">) {
  return (
    <div className="mx-auto max-w-xl px-4 py-8 md:py-12">
      <Suspense fallback={<OrderSkeleton />}>
        <OrderDetails params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function OrderDetails({ params, searchParams }: PageProps<"/order/[code]">) {
  await connection();
  const { code: raw } = await params;
  const { placed } = await searchParams;
  // Next.js already percent-decodes path params; decoding again throws a
  // URIError (500) if the value happens to contain a literal "%".
  const code = normalizeOrderCode(raw);
  if (!ORDER_CODE_PATTERN.test(code)) notFound();

  // Only non-sensitive fields: anyone with the order ID can view this page.
  const order = await prisma.order.findUnique({
    where: { orderCode: code },
    select: {
      orderCode: true,
      customerName: true,
      city: true,
      productSlug: true,
      quantity: true,
      total: true,
      status: true,
      trackingInfo: true,
      createdAt: true,
      events: { select: { status: true, createdAt: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) notFound();

  const product = getProduct(order.productSlug);
  const status = isOrderStatus(order.status) ? order.status : "PAYMENT_VERIFICATION";
  const firstName = order.customerName.split(" ")[0];
  const reachedAt = new Map(order.events.map((e) => [e.status, e.createdAt]));
  const currentIndex = TIMELINE.indexOf(status);
  const justPlaced = placed === "1";

  return (
    <>
      {justPlaced && (
        <div className="text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-tomato text-cream shadow-lg shadow-tomato/30">
            <CheckIcon className="h-8 w-8" />
          </span>
          <h1 className="mt-4 font-serif text-3xl font-black text-tomato sm:text-4xl">
            Thank you, {firstName}!
          </h1>
          <p className="mt-2 text-coffee">
            Your order is placed. We&apos;ll verify your payment and confirm on WhatsApp shortly.
          </p>
        </div>
      )}
      {!justPlaced && <h1 className="font-serif text-3xl font-black text-tomato">Order status</h1>}

      <div className="card mt-6 p-5 text-center">
        <p className="text-sm text-coffee/70">Your order ID</p>
        <p className="mt-1 font-mono text-2xl font-bold tracking-wider break-all sm:text-3xl">{order.orderCode}</p>
        <div className="mt-3 flex justify-center">
          <CopyButton text={order.orderCode} />
        </div>
        <p className="mt-3 text-xs text-coffee/85">
          Save this ID — you can use it to track your order anytime.
        </p>
      </div>

      <div className="card mt-4 p-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Current status</h2>
          <StatusBadge status={status} />
        </div>
        <p className="mt-2 text-sm text-coffee">{STATUS_DESCRIPTIONS[status]}</p>
        {order.trackingInfo && (
          <p className="mt-3 rounded-xl bg-paper px-3 py-2 text-sm">
            <b>Tracking:</b> {order.trackingInfo}
          </p>
        )}

        {currentIndex >= 0 && (
          <ol className="mt-5 space-y-0">
            {TIMELINE.map((step, i) => {
              const done = i <= currentIndex;
              const at = reachedAt.get(step);
              return (
                <li key={step} className="relative flex gap-3 pb-5 last:pb-0">
                  {i < TIMELINE.length - 1 && (
                    <span className={`absolute top-7 left-[13px] h-[calc(100%-1.5rem)] w-0.5 ${i < currentIndex ? "bg-tomato" : "bg-coffee/15"}`} />
                  )}
                  <span
                    className={`relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${done ? "bg-tomato text-cream" : "bg-paper ring-1 ring-coffee/20"}`}
                  >
                    {done && <CheckIcon className="h-4 w-4" />}
                  </span>
                  <div>
                    <p className={`font-semibold ${done ? "" : "text-coffee/50"}`}>{STATUS_LABELS[step]}</p>
                    {at && done && (
                      <p className="text-xs text-coffee/60">
                        {at.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <div className="card mt-4 p-5">
        <h2 className="font-semibold">Order summary</h2>
        <dl className="mt-3 space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt>{product?.name ?? "Hurlikattu"} × {order.quantity}</dt>
            <dd className="font-semibold">{formatINR(order.total)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Delivering to</dt>
            <dd>{order.city}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Expected dispatch</dt>
            <dd>Within {delivery.dispatchWithin} of confirmation</dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 grid gap-3">
        <a
          href={whatsappLink(`Hi! I placed order ${order.orderCode} for ${formatINR(order.total)}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn bg-whatsapp text-white hover:brightness-95"
        >
          <WhatsAppIcon className="h-5 w-5" /> Message us about this order
        </a>
        <Link href="/" className="btn-secondary">
          Back to {brand.name}
        </Link>
      </div>
    </>
  );
}

function OrderSkeleton() {
  return (
    <div className="space-y-4">
      <div className="card h-32 animate-pulse" />
      <div className="card h-64 animate-pulse" />
    </div>
  );
}
