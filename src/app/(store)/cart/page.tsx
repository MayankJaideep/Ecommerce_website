"use client";

import Link from "next/link";
import { useCart, useCartSummary } from "@/components/CartProvider";
import { OrderSummary } from "@/components/OrderSummary";
import { QuantityStepper } from "@/components/QuantityStepper";
import { BagIcon, TruckIcon } from "@/components/Icons";
import { delivery } from "@/lib/config";
import { formatINR } from "@/lib/pricing";

export default function CartPage() {
  const { setQuantity } = useCart();
  const { ready, line, product, totals } = useCartSummary();

  if (!ready) return <div className="mx-auto min-h-[50vh] max-w-xl px-4 py-10" />;

  if (!line || !product || !totals) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-paper text-coffee">
          <BagIcon className="h-8 w-8" />
        </span>
        <h1 className="mt-4 font-serif text-3xl font-black text-tomato">Your cart is empty</h1>
        <p className="mt-2 text-coffee">A warm bowl of huruli saaru is just a few taps away.</p>
        <Link href="/shop" className="btn-primary mt-6">
          Shop Hurlikattu
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <h1 className="font-serif text-3xl font-black text-tomato">Your cart</h1>
      <div className="mt-6">
        <OrderSummary product={product} quantity={line.quantity} totals={totals}>
          <div className="mt-2 flex items-center gap-3">
            <QuantityStepper
              size="sm"
              value={line.quantity}
              min={1}
              onChange={(q) => setQuantity(product.slug, q)}
            />
            <button
              type="button"
              onClick={() => setQuantity(product.slug, 0)}
              className="-my-2 py-2 text-sm font-semibold text-chilli hover:underline"
            >
              Remove
            </button>
          </div>
        </OrderSummary>
      </div>

      {line.quantity < delivery.freeShippingMinQty && (
        <button
          type="button"
          onClick={() => setQuantity(product.slug, delivery.freeShippingMinQty)}
          className="mt-4 w-full rounded-2xl border-2 border-dashed border-tomato/40 bg-tomato/5 px-4 py-3 text-left text-sm"
        >
          <b className="text-tomato">Tip:</b> Add one more packet for {formatINR(product.price)} and
          delivery becomes <b>free</b>. Tap to add →
        </button>
      )}

      <p className="mt-4 flex items-center gap-2 text-sm text-coffee/80">
        <TruckIcon className="h-5 w-5 text-tomato" /> Dispatched within {delivery.dispatchWithin}.
      </p>

      <Link href="/checkout" className="btn-primary mt-6 w-full text-lg">
        Checkout · {formatINR(totals.total)}
      </Link>
      <Link href="/shop" className="mt-3 block text-center text-sm font-semibold text-coffee hover:underline">
        ← Continue shopping
      </Link>
    </div>
  );
}
