"use client";

import { useState } from "react";
import { ProductCard } from "./ProductCard";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  oldPrice: number | null;
  images: { url: string; alt: string | null }[];
  category: { name: string; slug: string };
};

const INITIAL = 12;
const STEP = 12;

export function FeaturedGrid({ products }: { products: Product[] }) {
  const [count, setCount] = useState(INITIAL);
  const visible = products.slice(0, count);
  const remaining = products.length - count;

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-6">
        {visible.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setCount((c) => c + STEP)}
            className="group inline-flex items-center gap-3 border border-neutral-300 bg-white px-7 py-4 text-sm font-semibold uppercase tracking-wider text-psg-dark hover:border-psg-red hover:text-psg-red transition-colors"
          >
            Voir plus de maillots
            <span className="text-neutral-400 group-hover:text-psg-red">
              ({remaining} restant{remaining > 1 ? "s" : ""})
            </span>
            <span className="transition-transform group-hover:translate-y-0.5">↓</span>
          </button>
        </div>
      )}
    </>
  );
}
