"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { delivery } from "@/lib/config";
import type { Product } from "@/lib/product";
import { computeTotals, formatINR } from "@/lib/pricing";
import { useCart } from "./CartProvider";
import { QuantityStepper } from "./QuantityStepper";
import { CheckIcon, TruckIcon } from "./Icons";

export function BuyBox({ product }: { product: Product }) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem, setQuantity } = useCart();
  const router = useRouter();
  const totals = computeTotals(product.price, qty);
  const needed = delivery.freeShippingMinQty - qty;

  function addToCart() {
    addItem(product.slug, qty);
    setAdded(true);
  }

  function buyNow() {
    setQuantity(product.slug, qty);
    router.push("/checkout");
  }

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-3xl font-bold text-bark">{formatINR(product.price)}</p>
          <p className="text-sm text-coffee/70">per {product.weight} packet · incl. all taxes</p>
        </div>
        <QuantityStepper value={qty} onChange={setQty} />
      </div>

      <div className="mt-5 rounded-2xl bg-paper px-4 py-3 text-sm">
        <div className="flex justify-between">
          <span>
            {qty} × {product.weight}
          </span>
          <span className="font-semibold">{formatINR(totals.subtotal)}</span>
        </div>
        <div className="mt-1 flex justify-between">
          <span>Delivery</span>
          <span className={totals.shippingFee === 0 ? "font-semibold text-tomato" : ""}>
            {totals.shippingFee === 0 ? "FREE" : formatINR(totals.shippingFee)}
          </span>
        </div>
        <div className="mt-2 flex justify-between border-t border-coffee/10 pt-2 text-base font-bold">
          <span>Total</span>
          <span>{formatINR(totals.total)}</span>
        </div>
        {needed > 0 && (
          <p className="mt-2 text-xs text-coffee/80">
            Add {needed} more packet{needed > 1 ? "s" : ""} for <b>free delivery</b>.
          </p>
        )}
      </div>

      <div className="mt-5 grid gap-3">
        <button type="button" onClick={buyNow} disabled={!product.inStock} className="btn-primary w-full text-lg">
          {product.inStock ? `Buy Now · ${formatINR(totals.total)}` : "Out of stock"}
        </button>
        {added ? (
          <Link href="/cart" className="btn-secondary w-full">
            <CheckIcon className="h-5 w-5 text-tomato" /> Added — View cart
          </Link>
        ) : (
          <button type="button" onClick={addToCart} disabled={!product.inStock} className="btn-secondary w-full">
            Add to cart
          </button>
        )}
      </div>

      <p className="mt-4 flex items-start gap-2 text-sm text-coffee/80">
        <TruckIcon className="mt-0.5 h-5 w-5 shrink-0 text-tomato" />
        Dispatched in {delivery.dispatchWithin}. Karnataka {delivery.karnatakaEta}, rest of India{" "}
        {delivery.restOfIndiaEta}.
      </p>

      {/* Sticky Buy Now bar on mobile so the main action is always in reach */}
      <div data-sticky-buybar className="fixed inset-x-0 bottom-0 z-40 border-t border-coffee/10 bg-cream/95 p-3 backdrop-blur sm:hidden">
        <button type="button" onClick={buyNow} disabled={!product.inStock} className="btn-primary w-full">
          Buy Now · {qty} × {product.weight} · {formatINR(totals.total)}
        </button>
      </div>
    </div>
  );
}
