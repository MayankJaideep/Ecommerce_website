import { Suspense } from "react";
import Link from "next/link";
import { connection } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatINR } from "@/lib/pricing";
import { isOrderStatus, ORDER_STATUSES, STATUS_LABELS, type OrderStatus } from "@/lib/orders";
import { StatusBadge } from "@/components/StatusBadge";
import { LogoutButton } from "@/components/admin/LogoutButton";

// Orders that count towards sales: payment has been verified.
const PAID: OrderStatus[] = ["CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED"];
const PAGE_SIZE = 200;

export default function AdminPage({ searchParams }: PageProps<"/admin">) {
  return (
    <Suspense fallback={<div className="card h-96 animate-pulse" />}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}

async function Dashboard({ searchParams }: Pick<PageProps<"/admin">, "searchParams">) {
  await connection();
  await requireAdmin();

  const sp = await searchParams;
  const status = typeof sp.status === "string" && isOrderStatus(sp.status) ? sp.status : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim() : "";
  const requestedPage = typeof sp.page === "string" ? Number(sp.page) : 1;
  const page = Number.isFinite(requestedPage) && requestedPage >= 1 ? Math.floor(requestedPage) : 1;

  const where: Prisma.OrderWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { orderCode: { contains: q.toUpperCase() } },
            { phone: { contains: q } },
            { customerName: { contains: q } },
          ],
        }
      : {}),
  };

  const withFilters = (next: Record<string, string | number>) => {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (q) params.set("q", q);
    for (const [k, v] of Object.entries(next)) params.set(k, String(v));
    const qs = params.toString();
    return `/admin${qs ? `?${qs}` : ""}`;
  };

  const [orders, matching, paid, totalOrders, byStatus] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.order.count({ where }),
    prisma.order.aggregate({
      where: { status: { in: PAID } },
      _sum: { total: true, quantity: true },
      _count: true,
    }),
    prisma.order.count(),
    prisma.order.groupBy({ by: ["status"], _count: true }),
  ]);

  const counts = Object.fromEntries(byStatus.map((s) => [s.status, s._count])) as Record<string, number>;

  const stats = [
    { label: "Total sales (verified)", value: formatINR(paid._sum.total ?? 0) },
    { label: "Total orders", value: totalOrders },
    { label: "Awaiting verification", value: counts.PAYMENT_VERIFICATION ?? 0, highlight: true },
    { label: "Packets sold", value: paid._sum.quantity ?? 0 },
  ];

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold">Orders</h1>
        <LogoutButton />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className={`card p-4 ${s.highlight && Number(s.value) > 0 ? "ring-2 ring-lime" : ""}`}>
            <p className="text-xs font-semibold text-coffee/70">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      <form className="mt-6 flex gap-2" action="/admin">
        {status && <input type="hidden" name="status" value={status} />}
        <input name="q" defaultValue={q} placeholder="Search order ID, phone or name" className="input" />
        <button className="btn-primary px-5 py-3">Search</button>
      </form>

      <nav className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-2">
        <FilterChip href={q ? `/admin?q=${encodeURIComponent(q)}` : "/admin"} active={!status}>
          All ({totalOrders})
        </FilterChip>
        {ORDER_STATUSES.map((s) => (
          <FilterChip
            key={s}
            href={`/admin?status=${s}${q ? `&q=${encodeURIComponent(q)}` : ""}`}
            active={status === s}
          >
            {STATUS_LABELS[s]} ({counts[s] ?? 0})
          </FilterChip>
        ))}
      </nav>

      {orders.length === 0 ? (
        <div className="card mt-4 p-8 text-center text-coffee">
          <p>{page > 1 ? "No orders on this page." : "No orders found."}</p>
          {page > 1 && (
            <Link href={withFilters({ page: page - 1 })} className="mt-3 inline-block font-semibold text-tomato hover:underline">
              ← Previous page
            </Link>
          )}
        </div>
      ) : (
        <ul className="mt-4 grid gap-3">
          {orders.map((o) => (
            <li key={o.id}>
              <Link
                href={`/admin/orders/${o.id}`}
                className="card flex flex-col gap-2 p-4 transition hover:ring-tomato/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold">{o.orderCode}</span>
                    <StatusBadge status={o.status} />
                  </div>
                  <p className="mt-1 text-sm [overflow-wrap:anywhere]">
                    <b>{o.customerName}</b> · {o.phone} · {o.city}, {o.state}
                  </p>
                  <p className="text-xs text-coffee/60">
                    {o.createdAt.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}
                  </p>
                </div>
                <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-0">
                  <span className="text-lg font-bold">{formatINR(o.total)}</span>
                  <span className="text-sm text-coffee/70">{o.quantity} × 500 g</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {matching > PAGE_SIZE && (
        <nav className="mt-5 flex items-center justify-between gap-3">
          {page > 1 ? (
            <Link href={withFilters({ page: page - 1 })} className="btn-secondary px-4 py-2.5">
              ← Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="text-sm font-semibold text-coffee">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, matching)} of {matching}
          </span>
          {page * PAGE_SIZE < matching ? (
            <Link href={withFilters({ page: page + 1 })} className="btn-secondary px-4 py-2.5">
              Older →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </div>
  );
}

function FilterChip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold whitespace-nowrap ring-1 ${active ? "bg-bark text-cream ring-bark" : "bg-white ring-coffee/15 hover:bg-paper"}`}
    >
      {children}
    </Link>
  );
}
