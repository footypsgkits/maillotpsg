"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    flockingAvailable: boolean;
    flockingPrice: number;
    image: string;
    sizes: { id: string; label: string; kind: string; stock: number }[];
  };
};

export function ProductBuyForm({ product }: Props) {
  const router = useRouter();
  const [size, setSize] = useState<string | null>(product.sizes[0]?.label ?? null);
  const [flocking, setFlocking] = useState(false);
  const [flockingName, setFlockingName] = useState("");
  const [flockingNumber, setFlockingNumber] = useState("");
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState<string | null>(null);

  const sizesAdult = product.sizes.filter((s) => s.kind === "adulte");
  const sizesKid = product.sizes.filter((s) => s.kind === "enfant");

  function handleAdd(redirect: boolean) {
    setErr(null);
    if (!size) {
      setErr("Veuillez choisir une taille.");
      return;
    }
    if (flocking) {
      if (!flockingName.trim() && !flockingNumber.trim()) {
        setErr("Renseignez le nom ou le numéro pour le floquage.");
        return;
      }
      if (flockingNumber && !/^\d{1,2}$/.test(flockingNumber)) {
        setErr("Le numéro doit comporter 1 ou 2 chiffres.");
        return;
      }
    }
    addToCart({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.image,
      size,
      unitPrice: product.price,
      quantity: qty,
      flocking,
      flockingName: flocking ? flockingName.trim() || undefined : undefined,
      flockingNumber: flocking ? flockingNumber.trim() || undefined : undefined,
      flockingPrice: product.flockingPrice,
    });
    if (redirect) router.push("/panier");
  }

  return (
    <div className="mt-6 space-y-5">
      {(sizesAdult.length > 0 || sizesKid.length > 0) && (
        <div className="flex justify-end -mb-3">
          <a
            href="/guide/tailles"
            target="_blank"
            rel="noopener"
            className="text-xs font-semibold underline underline-offset-4 text-neutral-600 hover:text-psg-red"
          >
            Guide des tailles ↗
          </a>
        </div>
      )}
      {sizesAdult.length > 0 && (
        <SizeBlock
          label="Taille adulte"
          sizes={sizesAdult}
          selected={size}
          onSelect={setSize}
        />
      )}
      {sizesKid.length > 0 && (
        <SizeBlock
          label="Taille enfant"
          sizes={sizesKid}
          selected={size}
          onSelect={setSize}
        />
      )}
      {product.sizes.length === 0 && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm text-amber-800">
          Aucune taille n&apos;a encore été configurée pour ce produit.
        </div>
      )}

      {product.flockingAvailable && (
        <div className="rounded-xl border border-neutral-200 p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={flocking}
              onChange={(e) => setFlocking(e.target.checked)}
              className="mt-1 h-4 w-4"
            />
            <div className="flex-1">
              <div className="font-semibold">
                Floquage personnalisé
                <span className="ml-2 text-sm font-normal text-psg-blue">
                  +{formatPrice(product.flockingPrice)}
                </span>
              </div>
              <div className="text-sm text-neutral-500">
                Ajoutez le nom et le numéro de votre joueur préféré au dos du maillot.
              </div>
            </div>
          </label>
          {flocking && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-neutral-600">Nom (max 12 caractères)</label>
                <input
                  type="text"
                  maxLength={12}
                  value={flockingName}
                  onChange={(e) => setFlockingName(e.target.value.toUpperCase())}
                  placeholder="MBAPPÉ"
                  className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-psg-blue"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-600">Numéro</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={flockingNumber}
                  onChange={(e) => setFlockingNumber(e.target.value.replace(/\D/g, ""))}
                  placeholder="7"
                  className="mt-1 w-full border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-psg-blue"
                />
              </div>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium">Quantité</label>
        <div className="flex items-center border border-neutral-300 rounded-lg">
          <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1.5">−</button>
          <span className="px-4">{qty}</span>
          <button onClick={() => setQty((q) => q + 1)} className="px-3 py-1.5">+</button>
        </div>
      </div>

      {err && <p className="text-sm text-red-600">{err}</p>}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => handleAdd(false)}
          className="flex-1 bg-psg-blue hover:bg-psg-dark text-white font-semibold py-3 rounded-lg"
        >
          Ajouter au panier
        </button>
        <a
          href="https://www.instagram.com/maillots2psg"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-psg-red hover:bg-red-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
          </svg>
          Commander sur Instagram
        </a>
      </div>
    </div>
  );
}

function SizeBlock({
  label,
  sizes,
  selected,
  onSelect,
}: {
  label: string;
  sizes: { label: string; stock: number }[];
  selected: string | null;
  onSelect: (s: string) => void;
}) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">{label}</div>
      <div className="flex flex-wrap gap-2">
        {sizes.map((s) => {
          const out = s.stock <= 0;
          const active = selected === s.label;
          return (
            <button
              key={s.label}
              type="button"
              disabled={out}
              onClick={() => onSelect(s.label)}
              className={`min-w-12 px-3 py-2 rounded-lg border text-sm font-medium transition ${
                active
                  ? "bg-psg-blue text-white border-psg-blue"
                  : out
                  ? "bg-neutral-100 text-neutral-400 line-through border-neutral-200 cursor-not-allowed"
                  : "bg-white border-neutral-300 hover:border-psg-blue"
              }`}
            >
              {s.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
