"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";
import { delivery } from "@/lib/config";
import { getProduct } from "@/lib/product";
import { computeTotals } from "@/lib/pricing";

export type CartLine = { slug: string; quantity: number };

type CartContextValue = {
  lines: CartLine[];
  ready: boolean;
  itemCount: number;
  setQuantity: (slug: string, quantity: number) => void;
  addItem: (slug: string, quantity: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "hk-cart-v1";
const EMPTY: CartLine[] = [];

const clampQty = (q: number) => Math.max(0, Math.min(delivery.maxQtyPerOrder, Math.floor(q)));

// ---- localStorage-backed store (works with useSyncExternalStore) ----
let cache: CartLine[] | null = null;
const listeners = new Set<() => void>();

function readStorage(): CartLine[] {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    if (!Array.isArray(saved)) return EMPTY;
    return saved
      .filter((l) => getProduct(l?.slug) && Number.isFinite(l?.quantity))
      .map((l) => ({ slug: l.slug, quantity: clampQty(l.quantity) }))
      .filter((l) => l.quantity > 0);
  } catch {
    return EMPTY;
  }
}

function getSnapshot() {
  return (cache ??= readStorage());
}

function write(next: CartLine[]) {
  cache = next;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  // Keep multiple open tabs in sync.
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

const noopSubscribe = () => () => {};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const lines = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY);
  // false during server render & hydration, true once running in the browser.
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const setQuantity = useCallback((slug: string, quantity: number) => {
    const q = clampQty(quantity);
    const rest = getSnapshot().filter((l) => l.slug !== slug);
    write(q > 0 ? [...rest, { slug, quantity: q }] : rest);
  }, []);

  const addItem = useCallback((slug: string, quantity: number) => {
    const current = getSnapshot();
    const existing = current.find((l) => l.slug === slug)?.quantity ?? 0;
    write([...current.filter((l) => l.slug !== slug), { slug, quantity: clampQty(existing + quantity) }]);
  }, []);

  const clear = useCallback(() => write(EMPTY), []);

  const value = useMemo(
    () => ({
      lines,
      ready,
      itemCount: lines.reduce((n, l) => n + l.quantity, 0),
      setQuantity,
      addItem,
      clear,
    }),
    [lines, ready, setQuantity, addItem, clear],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}

// The store sells a single product today, so checkout works off the first line.
export function useCartSummary() {
  const { lines, ready } = useCart();
  const line = lines[0];
  const product = line ? getProduct(line.slug) : undefined;
  const totals = product && line ? computeTotals(product.price, line.quantity) : null;
  return { ready, line, product, totals };
}
