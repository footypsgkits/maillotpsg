import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Livraison & retours",
  description: "Toutes les informations sur la livraison et la politique de retour des maillots PSG commandés sur Maillot-PSG.",
  alternates: { canonical: "/livraison-retours" },
};

export default function ShippingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral">
      <h1>Livraison & retours</h1>
      <h2>Livraison</h2>
      <p>
        Toutes les commandes sont préparées sous 1 à 2 jours ouvrés. Comptez ensuite 8 à 10 jours
        ouvrés d&apos;acheminement avec suivi, soit un total de <strong>9 à 12 jours ouvrés</strong> entre
        la commande et la réception, en France métropolitaine comme en Europe.
      </p>
      <ul>
        <li>Livraison incluse, suivi en ligne fourni par message privé Instagram</li>
        <li>France métropolitaine, Belgique, Luxembourg, Suisse : 9 à 12 jours ouvrés</li>
        <li>Reste de l&apos;Europe : 9 à 12 jours ouvrés</li>
      </ul>
      <h2>Paiement</h2>
      <p>
        Le paiement se finalise par message privé sur notre compte Instagram <a href="https://www.instagram.com/maillot.psg" target="_blank" rel="noopener noreferrer">@maillot.psg</a> après ajout au panier (PayPal, virement, Lydia).
      </p>
      <h2>Retours et échanges</h2>
      <p>
        Vous disposez de 14 jours après réception pour retourner votre maillot. Les maillots
        floqués personnalisés ne peuvent être retournés sauf défaut produit. L&apos;échange de
        taille est gratuit.
      </p>
    </div>
  );
}
