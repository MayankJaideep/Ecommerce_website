"use client";

import { useState } from "react";
import Link from "next/link";
import { brand } from "@/lib/config";
import { useCart } from "./CartProvider";

const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/#story", label: "Our Story" },
  { href: "/#faq", label: "FAQ" },
  { href: "/track", label: "Track Order" },
];

export function Header() {
  const { itemCount, ready } = useCart();
  const count = ready ? itemCount : 0;
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-tomato/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-2 px-3 font-mono text-xs font-bold text-tomato sm:gap-4 sm:px-4 sm:text-[13px]">
        <nav className="flex items-center gap-5 lg:gap-7">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`-mx-1 px-1 py-3 hover:underline underline-offset-4 ${i === 0 ? "" : i === 3 ? "hidden lg:inline" : "hidden md:inline"}`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link href="/" className="inline-block py-2.5 text-center" aria-label={`${brand.name} home`}>
          <span className="font-serif text-[1.5rem] leading-none font-black tracking-tight text-tomato sm:text-3xl">
            {brand.shortName.toLowerCase()}
          </span>
        </Link>

        <div className="flex items-center justify-end gap-1 whitespace-nowrap sm:gap-4">
          <Link
            href="/cart"
            className="inline-flex items-center py-3.5 hover:underline underline-offset-4"
            aria-label={`Cart, ${count} items`}
          >
            Cart ({String(count).padStart(2, "0")})
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="-mx-1 flex flex-col gap-1.5 px-2 py-3.5"
          >
            <span className={`block h-0.5 w-7 bg-tomato transition sm:w-9 ${open ? "translate-y-1 rotate-12" : ""}`} />
            <span className={`block h-0.5 w-7 bg-tomato transition sm:w-9 ${open ? "-translate-y-1 -rotate-12" : ""}`} />
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-tomato/10 bg-cream">
          <ul className="mx-auto grid max-w-7xl gap-1 px-4 py-4 sm:grid-cols-4">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-2 font-serif text-3xl font-black text-tomato hover:text-tomato-dark"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
