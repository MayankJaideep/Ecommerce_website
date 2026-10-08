import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { ORDER_STATUSES } from "@/lib/orders";

const patchSchema = z.object({
  status: z.enum(ORDER_STATUSES).optional(),
  trackingInfo: z.string().trim().max(200).optional(),
  adminNote: z.string().trim().max(1000).optional(),
});

export async function PATCH(req: Request, ctx: RouteContext<"/api/admin/orders/[id]">) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const parsed = patchSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  const { status, trackingInfo, adminNote } = parsed.data;

  // Read + write in one transaction so concurrent updates can't both decide
  // "the status changed" (duplicate audit event) or both decide it didn't.
  const order = await prisma.$transaction(async (tx) => {
    const existing = await tx.order.findUnique({ where: { id }, select: { status: true } });
    if (!existing) return null;
    return tx.order.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(trackingInfo !== undefined ? { trackingInfo: trackingInfo || null } : {}),
        ...(adminNote !== undefined ? { adminNote: adminNote || null } : {}),
        ...(status && status !== existing.status ? { events: { create: { status } } } : {}),
      },
      select: { id: true, status: true, trackingInfo: true, adminNote: true },
    });
  });
  if (!order) return NextResponse.json({ error: "Order not found." }, { status: 404 });
  return NextResponse.json(order);
}
