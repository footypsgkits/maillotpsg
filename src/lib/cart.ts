"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  image: string;
  size: string;
  unitPrice: number;
  quantity: number;
  flocking: boolean;
  flockingName?: string;
  flockingNumber?: string;
  flockingPrice: number;
};

const KEY = "psg_cart_v1";

function read(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:update"));
}

const listeners = new Set<() => void>();
if (typeof window !== "undefined") {
  window.addEventListener("cart:update", () => {
    listeners.forEach((l) => l());
  });
  window.addEventListener("storage", (e) => {
    if (e.key === KEY) listeners.forEach((l) => l());
  });
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useCart() {
  const items = useSyncExternalStore(
    subscribe,
    () => JSON.stringify(read()),
    () => "[]",
  );
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  const parsed: CartItem[] = hydrated ? JSON.parse(items) : [];
  return {
    items: parsed,
    count: parsed.reduce((s, i) => s + i.quantity, 0),
    total: parsed.reduce(
      (s, i) =>
        s + i.quantity * (i.unitPrice + (i.flocking ? i.flockingPrice : 0)),
      0,
    ),
  };
}

export function addToCart(item: CartItem) {
  const items = read();
  const idx = items.findIndex(
    (i) =>
      i.productId === item.productId &&
      i.size === item.size &&
      i.flocking === item.flocking &&
      i.flockingName === item.flockingName &&
      i.flockingNumber === item.flockingNumber,
  );
  if (idx >= 0) items[idx].quantity += item.quantity;
  else items.push(item);
  write(items);
}

export function removeFromCart(index: number) {
  const items = read();
  items.splice(index, 1);
  write(items);
}

export function updateQuantity(index: number, qty: number) {
  const items = read();
  if (!items[index]) return;
  items[index].quantity = Math.max(1, qty);
  write(items);
}

export function clearCart() {
  write([]);
}
