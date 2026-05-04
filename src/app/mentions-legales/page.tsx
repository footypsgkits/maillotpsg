import type { Metadata } from "next";
import { SITE } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Mentions légales",
  description: "Mentions légales de la boutique Maillot-PSG.",
  alternates: { canonical: "/mentions-legales" },
  robots: { index: false, follow: true },
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral">
      <h1>Mentions légales</h1>
      <p>
        <strong>Éditeur du site :</strong> {SITE.name}. À compléter avec la raison sociale, SIRET et adresse.
      </p>
      <p><strong>Email :</strong> {SITE.email}</p>
      <p><strong>Hébergement :</strong> Vercel Inc.</p>
      <p>
        Maillot-PSG est un site indépendant. La marque et le logo Paris Saint-Germain sont la propriété
        du Paris Saint-Germain Football Club. Ce site n&apos;est ni affilié, ni soutenu, ni reconnu par
        le club.
      </p>
    </div>
  );
}
