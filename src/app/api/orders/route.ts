import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getProduct } from "@/lib/product";
import { computeTotals } from "@/lib/pricing";
import { generateOrderCode } from "@/lib/orders";
import { checkoutSchema, MAX_SCREENSHOT_BYTES } from "@/lib/validation";
import { deleteScreenshot, detectImageType, saveScreenshot } from "@/lib/storage";
import { clientIp, rateLimit } from "@/lib/rate-limit";

// Generous ceiling for the whole multipart body: the screenshot plus every
// text field. Route handlers have no built-in body limit, so reject before
// buffering an arbitrarily large upload into memory.
const MAX_BODY_BYTES = MAX_SCREENSHOT_BYTES + 64 * 1024;

export async function POST(req: Request) {
  if (!rateLimit(`order:${clientIp(req)}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many orders from this device. Please message us on WhatsApp." },
      { status: 429 },
    );
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { error: "Screenshot is too large (max 5 MB).", fieldErrors: { screenshot: "Max 5 MB" } },
      { status: 413 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form submission." }, { status: 400 });
  }

  const fields = Object.fromEntries(
    [...form.entries()].filter(([, v]) => typeof v === "string"),
  );
  const parsed = checkoutSchema.safeParse(fields);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return NextResponse.json(
      { error: "Please check the highlighted fields.", fieldErrors },
      { status: 400 },
    );
  }
  const input = parsed.data;

  const product = getProduct(input.productSlug);
  if (!product || !product.inStock) {
    return NextResponse.json({ error: "This product is currently unavailable." }, { status: 400 });
  }

  const file = form.get("screenshot");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json(
      { error: "Please upload your payment screenshot.", fieldErrors: { screenshot: "Required" } },
      { status: 400 },
    );
  }
  if (file.size > MAX_SCREENSHOT_BYTES) {
    return NextResponse.json(
      { error: "Screenshot is too large (max 5 MB).", fieldErrors: { screenshot: "Max 5 MB" } },
      { status: 400 },
    );
  }
  const buf = Buffer.from(await file.arrayBuffer());
  const imageType = detectImageType(buf);
  if (!imageType) {
    return NextResponse.json(
      {
        error: "Screenshot must be a JPG, PNG or WEBP image.",
        fieldErrors: { screenshot: "JPG, PNG or WEBP only" },
      },
      { status: 400 },
    );
  }

  const totals = computeTotals(product.price, input.quantity);

  // Retry on the (very unlikely) chance of an order code collision.
  for (let attempt = 0; attempt < 3; attempt++) {
    const orderCode = generateOrderCode();
    let key: string | null = null;
    try {
      key = await saveScreenshot(buf, imageType, orderCode);
      const order = await prisma.order.create({
        data: {
          orderCode,
          customerName: input.customerName,
          phone: input.phone,
          email: input.email,
          addressLine1: input.addressLine1,
          addressLine2: input.addressLine2,
          landmark: input.landmark,
          city: input.city,
          state: input.state,
          pincode: input.pincode,
          customerNote: input.customerNote,
          upiTxnId: input.upiTxnId,
          productSlug: product.slug,
          quantity: input.quantity,
          unitPrice: product.price,
          ...totals,
          paymentScreenshotKey: key,
          paymentScreenshotType: imageType,
          status: "PAYMENT_VERIFICATION",
          events: { create: { status: "PAYMENT_VERIFICATION", note: "Order placed" } },
        },
        select: { orderCode: true, total: true },
      });
      return NextResponse.json(order, { status: 201 });
    } catch (err) {
      // No order row references this file — remove it before retrying/leaving.
      if (key) await deleteScreenshot(key);
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") continue;
      console.error("Failed to create order", err);
      return NextResponse.json(
        { error: "Something went wrong while placing your order. Please try again." },
        { status: 500 },
      );
    }
  }
  return NextResponse.json({ error: "Please try again." }, { status: 500 });
}
