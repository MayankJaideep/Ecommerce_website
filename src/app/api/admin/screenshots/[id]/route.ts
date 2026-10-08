import { prisma } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { readScreenshot } from "@/lib/storage";

// Streams an order's payment screenshot to an authenticated admin only.
export async function GET(_req: Request, ctx: RouteContext<"/api/admin/screenshots/[id]">) {
  if (!(await isAdmin())) return new Response("Unauthorized", { status: 401 });

  const { id } = await ctx.params;
  const order = await prisma.order.findUnique({
    where: { id },
    select: { paymentScreenshotKey: true, paymentScreenshotType: true },
  });
  if (!order) return new Response("Not found", { status: 404 });

  const file = await readScreenshot(order.paymentScreenshotKey);
  if (!file) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": order.paymentScreenshotType,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
