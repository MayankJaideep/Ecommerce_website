import type { Product } from "@/lib/product";
import type { Totals } from "@/lib/pricing";
import { formatINR } from "@/lib/pricing";
import { Photo } from "./Photo";

export function OrderSummary({
  product,
  quantity,
  totals,
  children,
}: {
  product: Product;
  quantity: number;
  totals: Totals;
  children?: React.ReactNode;
}) {
  const thumb = product.images[0];

  return (
    <div className="card p-5">
      <div className="flex items-center gap-3 sm:gap-4">
        {thumb ? (
          <Photo
            src={thumb.src}
            alt={thumb.alt}
            width={80}
            height={80}
            className="h-16 w-16 shrink-0 rounded-2xl object-cover sm:h-20 sm:w-20"
          />
        ) : (
          <div className="h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br from-peach via-blush to-tomato/20 flex items-center justify-center sm:h-20 sm:w-20">
            <span className="font-serif text-lg font-black text-tomato/50">HK</span>
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{product.name}</p>
          <p className="text-sm text-coffee/70">
            {quantity > 1
              ? `${product.weight} × ${quantity} (${(quantity * 0.5).toFixed(1).replace(/\.0$/, "")} kg)`
              : `${product.weight} × ${quantity}`}
          </p>
        </div>
        <p className="shrink-0 whitespace-nowrap font-semibold">{formatINR(totals.subtotal)}</p>
      </div>
      {children && <div className="mt-3">{children}</div>}
      <dl className="mt-4 space-y-1.5 border-t border-coffee/10 pt-4 text-sm">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd>{formatINR(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt>Delivery</dt>
          <dd className="font-semibold text-tomato">{formatINR(totals.shippingFee)}</dd>
        </div>
        <div className="flex justify-between border-t border-coffee/10 pt-2 text-lg font-bold">
          <dt>Total</dt>
          <dd>{formatINR(totals.total)}</dd>
        </div>
      </dl>
    </div>
  );
}
