import type { Metadata } from "next";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez l'équipe Maillot-PSG : questions sur un maillot, commande, floquage, livraison ou retour.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral">
      <h1>Contact</h1>
      <p>
        Une question sur un maillot, votre commande ou un floquage ? L&apos;équipe Maillot-PSG vous
        répond rapidement.
      </p>
      <ul>
        <li>Email : <a href={`mailto:${SITE.email}`}>{SITE.email}</a></li>
        <li>
          Instagram :{" "}
          <a href={SITE.social.instagram} target="_blank" rel="noopener noreferrer">
            @maillot.psg
          </a>{" "}
          (réponse en DM)
        </li>
        <li>
          TikTok :{" "}
          <a href={SITE.social.tiktok} target="_blank" rel="noopener noreferrer">
            @maillot.psg
          </a>
        </li>
        <li>Adresse : {SITE.address.locality}, {SITE.address.region}, France</li>
      </ul>
      <p className="text-sm text-neutral-500">
        Délai de réponse moyen : sous 24h ouvrées.
      </p>
    </div>
  );
}
