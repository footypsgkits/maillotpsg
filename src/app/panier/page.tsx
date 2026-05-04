import type { Metadata } from "next";
import { CartView } from "@/components/CartView";

export const metadata: Metadata = {
  title: "Mon panier",
  description: "Récapitulatif de votre commande de maillots du PSG.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl md:text-4xl font-black">Mon panier</h1>
      <CartView />
    </div>
  );
}
