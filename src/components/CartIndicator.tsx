"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";

export function CartIndicator() {
  const { count } = useCart();
  return (
    <Link
      href="/panier"
      aria-label="Voir le panier"
      className="relative inline-flex items-center gap-1 text-sm font-medium hover:text-psg-red"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-2 -right-3 bg-psg-red text-white text-[10px] font-bold rounded-full h-5 min-w-5 px-1 grid place-items-center">
          {count}
        </span>
      )}
    </Link>
  );
}
