import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatINR } from "@/lib/pricing";
import { getProduct } from "@/lib/product";
import { isOrderStatus, STATUS_LABELS } from "@/lib/orders";
import { StatusBadge } from "@/components/StatusBadge";
import { CopyButton } from "@/components/CopyButton";
import { WhatsAppIcon } from "@/components/Icons";
import { OrderControls } from "@/components/admin/OrderControls";

export default function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  return (
    <Suspense fallback={<div className="card h-96 animate-pulse" />}>
      <OrderDetail params={params} />
    </Suspense>
  );
}

const fmtDate = (d: Date) =>
  d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });

async function OrderDetail({ params }: Pick<PageProps<"/admin/orders/[id]">, "params">) {
  await connection();
  await requireAdmin();
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { events: { orderBy: { createdAt: "desc" } } },
  });
  if (!order) notFound();

  const product = getProduct(order.productSlug);
  const status = isOrderStatus(order.status) ? order.status : "PAYMENT_VERIFICATION";
  const address = [
    order.customerName,
    order.addressLine1,
    order.addressLine2,
    order.landmark && `Landmark: ${order.landmark}`,
    `${order.city}, ${order.state} - ${order.pincode}`,
    `Phone: ${order.phone}`,
  ]
    .filter(Boolean)
    .join("\n");
  const waCustomer = `https://wa.me/91${order.phone}?text=${encodeURIComponent(
    `Hi ${order.customerName.split(" ")[0]}, this is about your Hurlikattu order ${order.orderCode}. Status: ${STATUS_LABELS[status]}.`,
  )}`;
  const screenshotUrl = `/api/admin/screenshots/${order.id}`;

  return (
    <div>
      <Link href="/admin" className="text-sm font-semibold text-coffee hover:underline">
        ← All orders
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-mono text-2xl font-bold sm:text-3xl">{order.orderCode}</h1>
        <StatusBadge status={status} />
      </div>
      <p className="text-sm text-coffee/70">Placed {fmtDate(order.createdAt)}</p>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          <section className="card p-5">
            <h2 className="font-semibold">Payment</h2>
            <dl className="mt-3 grid grid-cols-2 gap-y-1.5 text-sm">
              <dt>{product?.name ?? order.productSlug} × {order.quantity}</dt>
              <dd className="text-right">{formatINR(order.subtotal)}</dd>
              <dt>Delivery</dt>
              <dd className="text-right">{order.shippingFee ? formatINR(order.shippingFee) : "Free"}</dd>
              <dt className="text-base font-bold">Amount to verify</dt>
              <dd className="text-right text-base font-bold">{formatINR(order.total)}</dd>
              <dt>UPI txn / UTR</dt>
              <dd className="text-right font-mono">{order.upiTxnId ?? "—"}</dd>
            </dl>
            <a href={screenshotUrl} target="_blank" rel="noopener noreferrer" className="mt-4 block">
              {/* eslint-disable-next-line @next/next/no-img-element -- private, auth-gated image */}
              <img
                src={screenshotUrl}
                alt="Customer payment screenshot"
                className="max-h-[480px] w-full rounded-2xl bg-paper object-contain ring-1 ring-coffee/10"
              />
              <span className="mt-1 block text-center text-xs text-coffee/70">Tap to open full size</span>
            </a>
          </section>

          <section className="card p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">Customer &amp; delivery address</h2>
              <CopyButton text={address} label="Copy address" />
            </div>
            <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">{address}</p>
            {order.email && <p className="mt-1 text-sm">Email: {order.email}</p>}
            {order.customerNote && (
              <p className="mt-3 rounded-xl bg-lime/10 px-3 py-2 text-sm">
                <b>Customer note:</b> {order.customerNote}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              <a href={waCustomer} target="_blank" rel="noopener noreferrer" className="btn bg-whatsapp px-4 py-2.5 text-sm text-white">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp customer
              </a>
              <a href={`tel:+91${order.phone}`} className="btn-secondary px-4 py-2.5 text-sm">
                Call
              </a>
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <OrderControls
            key={order.updatedAt.toISOString()}
            orderId={order.id}
            status={status}
            trackingInfo={order.trackingInfo ?? ""}
            adminNote={order.adminNote ?? ""}
          />
          <section className="card p-5">
            <h2 className="font-semibold">History</h2>
            <ol className="mt-3 space-y-2 text-sm">
              {order.events.map((e) => (
                <li key={e.id} className="flex justify-between gap-3">
                  <span>{isOrderStatus(e.status) ? STATUS_LABELS[e.status] : e.status}</span>
                  <span className="text-coffee/60">{fmtDate(e.createdAt)}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
}
