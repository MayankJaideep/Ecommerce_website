"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";

// Small pill used on photo panels: adds one packet, then turns into a link to the cart.
export function AddToCartPill({ slug, variant = "light" }: { slug: string; variant?: "light" | "dark" }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const style =
    variant === "dark"
      ? "bg-tomato text-cream hover:bg-tomato-dark"
      : "bg-cream text-bark hover:bg-white";
  const base = `shrink-0 rounded-full px-4 py-1.5 font-mono text-xs font-bold shadow-sm transition active:scale-95 ${style}`;

  if (added) {
    return (
      <Link href="/cart" className={base}>
        View Cart →
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => {
        addItem(slug, 1);
        setAdded(true);
      }}
      className={base}
    >
      Add to Cart
    </button>
  );
}
