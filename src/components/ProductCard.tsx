"use client";

import { useState } from "react";
import Link from "next/link";
import { Photo } from "./Photo";
import { useCart } from "./CartProvider";

export type ProductCardProps = {
  title: string;
  weightLabel: string;
  originalPrice?: string;
  price: string;
  imageSrc: string;
  imageAlt: string;
  slug: string;
  quantityToAdd: number;
  bgGradient: string;
  badge?: string;
};

export function ProductCard({
  title,
  weightLabel,
  originalPrice,
  price,
  imageSrc,
  imageAlt,
  slug,
  quantityToAdd,
  bgGradient,
  badge = "Sale",
}: ProductCardProps) {
  const { addItem } = useCart();
  const [addedCount, setAddedCount] = useState(0);

  const handleAdd = () => {
    addItem(slug, quantityToAdd);
    setAddedCount((c) => c + 1);
  };

  const totalKgAdded = (addedCount * (quantityToAdd * 0.5)).toFixed(1).replace(/\.0$/, "");

  return (
    <div
      className={`group relative flex flex-col justify-between overflow-hidden rounded-[2.2rem] p-6 sm:p-7 shadow-xl shadow-bark/10 transition-all duration-300 hover:shadow-2xl ${bgGradient} min-h-[500px] sm:min-h-[560px] md:min-h-[590px]`}
    >
      {/* Top badges */}
      <div className="z-10 flex w-full items-center justify-between">
        <span className="rounded-full bg-cream/90 backdrop-blur-md px-3.5 py-1 font-mono text-xs font-bold text-bark shadow-sm">
          {weightLabel}
        </span>
        {badge && (
          <span className="rounded-full bg-white px-4 py-1 text-xs font-semibold tracking-wide text-bark shadow-sm">
            {badge}
          </span>
        )}
      </div>

      {/* Main product photo */}
      <div className="relative my-auto flex h-full min-h-[290px] sm:min-h-[340px] w-full items-center justify-center overflow-hidden py-4">
        <Photo
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="(min-width: 1024px) 540px, (min-width: 768px) 50vw, 100vw"
          className="object-cover rounded-2xl transition duration-700 ease-out group-hover:scale-105"
        />
        {/* Soft radial overlay around edges for seamless integration */}
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-black/5" />
      </div>

      {/* Bottom info & action */}
      <div className="z-10 mt-auto flex flex-col items-center pt-4 text-center">
        <h3 className="font-serif text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-md">
          {title}
        </h3>

        <div className="mt-1 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold text-white/95 drop-shadow-sm">
          {originalPrice && (
            <span className="text-white/60 line-through font-normal">{originalPrice}</span>
          )}
          <span>{price}</span>
        </div>

        <div className="mt-4 flex w-full justify-center">
          {addedCount === 0 ? (
            <button
              type="button"
              onClick={handleAdd}
              className="w-full max-w-[260px] rounded-full bg-white py-3.5 px-6 font-mono text-xs font-black uppercase tracking-widest text-bark shadow-xl transition-all duration-200 hover:-translate-y-0.5 hover:bg-cream hover:shadow-2xl active:translate-y-0 active:scale-95"
            >
              ADD TO CART
            </button>
          ) : (
            <div className="flex w-full max-w-sm flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={handleAdd}
                className="rounded-full bg-white/95 px-4 py-3 font-mono text-xs font-bold uppercase tracking-wide text-bark shadow-md transition hover:bg-white active:scale-95"
              >
                + Add {weightLabel}
              </button>
              <Link
                href="/cart"
                className="flex items-center justify-center gap-1.5 rounded-full bg-tomato px-5 py-3 font-mono text-xs font-bold uppercase tracking-wide text-cream shadow-md transition hover:bg-tomato-dark active:scale-95"
              >
                View Cart ({totalKgAdded} kg) →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
