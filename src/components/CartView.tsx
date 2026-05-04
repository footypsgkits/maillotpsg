"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { clearCart, removeFromCart, updateQuantity, useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";

export function CartView() {
  const { items, total } = useCart();
  const [step, setStep] = useState<"cart" | "checkout" | "done">("cart");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  if (step === "done") {
    return (
      <div className="mt-10 rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <h2 className="text-2xl font-bold text-green-800">Merci pour votre commande !</h2>
        <p className="text-green-700 mt-2">
          Votre commande {orderId ? <strong>#{orderId.slice(-6).toUpperCase()}</strong> : null} a bien été enregistrée.
          Nous vous contactons par email pour le paiement et la livraison.
        </p>
        <Link href="/" className="inline-block mt-5 bg-psg-blue text-white px-5 py-2.5 rounded-lg">
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border-2 border-dashed border-neutral-300 p-10 text-center bg-neutral-50">
        <p className="text-neutral-600">Votre panier est vide.</p>
        <Link href="/maillots" className="inline-block mt-5 bg-psg-blue text-white px-5 py-2.5 rounded-lg">
          Voir les maillots
        </Link>
      </div>
    );
  }

  async function submitOrder(form: FormData) {
    setSubmitting(true);
    setErr(null);
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items,
        customer: Object.fromEntries(form.entries()),
      }),
    });
    if (res.ok) {
      const j = await res.json();
      clearCart();
      setOrderId(j.id);
      setStep("done");
    } else {
      const j = await res.json().catch(() => ({}));
      setErr(j.error ?? "Erreur lors de la création de la commande.");
    }
    setSubmitting(false);
  }

  return (
    <div className="grid lg:grid-cols-[1fr_360px] gap-8 mt-6">
      <div className="space-y-3">
        {items.map((it, idx) => (
          <div key={idx} className="flex gap-4 p-3 border border-neutral-200 rounded-xl bg-white">
            <div className="w-24 h-28 relative bg-neutral-100 rounded-lg overflow-hidden shrink-0">
              {it.image && (
                <Image src={it.image} alt={it.name} fill className="object-cover" unoptimized />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold">{it.name}</div>
              <div className="text-sm text-neutral-500">Taille : {it.size}</div>
              {it.flocking && (
                <div className="text-sm text-neutral-500">
                  Floquage : {it.flockingName ?? ""} {it.flockingNumber ?? ""}
                  {" "}<span className="text-psg-blue">+{formatPrice(it.flockingPrice)}</span>
                </div>
              )}
              <div className="mt-2 flex items-center gap-3">
                <div className="flex items-center border border-neutral-300 rounded-lg">
                  <button onClick={() => updateQuantity(idx, it.quantity - 1)} className="px-2.5 py-1">−</button>
                  <span className="px-3 text-sm">{it.quantity}</span>
                  <button onClick={() => updateQuantity(idx, it.quantity + 1)} className="px-2.5 py-1">+</button>
                </div>
                <button onClick={() => removeFromCart(idx)} className="text-sm text-neutral-500 hover:text-red-600">
                  Supprimer
                </button>
              </div>
            </div>
            <div className="font-bold text-psg-blue whitespace-nowrap">
              {formatPrice((it.unitPrice + (it.flocking ? it.flockingPrice : 0)) * it.quantity)}
            </div>
          </div>
        ))}
      </div>

      <aside className="rounded-xl border border-neutral-200 bg-white p-5 h-fit space-y-4 sticky top-24">
        <div className="flex justify-between text-sm">
          <span>Sous-total</span>
          <span>{formatPrice(total)}</span>
        </div>
        <div className="flex justify-between text-sm text-neutral-500">
          <span>Livraison</span>
          <span>Calculée à l&apos;étape suivante</span>
        </div>
        <div className="border-t border-neutral-200 pt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        {step === "cart" ? (
          <a
            href="https://www.instagram.com/maillots2psg"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-psg-red hover:bg-red-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
            Commander sur Instagram
          </a>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitOrder(new FormData(e.currentTarget));
            }}
            className="space-y-3 pt-2 border-t border-neutral-200"
          >
            <div className="font-semibold">Vos coordonnées</div>
            <Field name="fullName" placeholder="Nom complet" required />
            <Field name="email" type="email" placeholder="Email" required />
            <Field name="phone" placeholder="Téléphone" />
            <Field name="address" placeholder="Adresse" required />
            <div className="grid grid-cols-2 gap-2">
              <Field name="zip" placeholder="Code postal" required />
              <Field name="city" placeholder="Ville" required />
            </div>
            <textarea
              name="notes"
              placeholder="Notes (optionnel)"
              rows={2}
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-psg-blue"
            />
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button
              disabled={submitting}
              className="w-full bg-psg-red hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-3 rounded-lg"
            >
              {submitting ? "Envoi…" : "Confirmer la commande"}
            </button>
            <p className="text-xs text-neutral-500">
              En validant, vous recevez un email de confirmation. Le paiement se finalise par lien sécurisé.
            </p>
          </form>
        )}
      </aside>
    </div>
  );
}

function Field({
  name,
  type = "text",
  placeholder,
  required,
}: {
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full border border-neutral-300 rounded-lg px-3 py-2 outline-none focus:border-psg-blue"
    />
  );
}
