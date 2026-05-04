import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente",
  description: "CGV de la boutique Maillot-PSG.",
  alternates: { canonical: "/cgv" },
  robots: { index: false, follow: true },
};

export default function CgvPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral">
      <h1>Conditions Générales de Vente</h1>
      <p>Version provisoire à compléter avec votre conseil juridique avant mise en production réelle.</p>
      <h2>1. Objet</h2>
      <p>Les présentes CGV régissent les ventes effectuées sur le site Maillot-PSG.</p>
      <h2>2. Produits</h2>
      <p>Les produits proposés sont des maillots de football indépendants, non affiliés au club du Paris Saint-Germain.</p>
      <h2>3. Prix</h2>
      <p>Les prix sont indiqués en euros TTC, hors frais de livraison.</p>
      <h2>4. Commande</h2>
      <p>La commande est validée à la confirmation de paiement.</p>
      <h2>5. Droit de rétractation</h2>
      <p>Le client dispose de 14 jours après réception pour exercer son droit de rétractation, sauf produit personnalisé (floquage).</p>
    </div>
  );
}
