import Link from "next/link";
import Image from "next/image";
import { formatPrice } from "@/lib/utils";

type Props = {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    oldPrice: number | null;
    images: { url: string; alt: string | null }[];
    category: { name: string; slug: string };
  };
};

export function ProductCard({ product }: Props) {
  const cover = product.images[0];
  return (
    <Link
      href={`/produit/${product.slug}`}
      className="group rounded-xl overflow-hidden bg-white border border-neutral-200 hover:border-psg-blue hover:shadow-lg transition"
    >
      <div className="aspect-[4/5] bg-neutral-100 overflow-hidden">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt ?? product.name}
            width={400}
            height={500}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="w-full h-full object-cover group-hover:scale-105 transition"
            {...(cover.url.startsWith("http") ? { unoptimized: true } : {})}
          />
        ) : (
          <div className="w-full h-full grid place-items-center text-neutral-400 text-sm">
            Photo bientôt disponible
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="text-xs uppercase tracking-wider text-neutral-500">{product.category.name}</div>
        <div className="font-semibold mt-0.5 line-clamp-2">{product.name}</div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-bold text-psg-blue">{formatPrice(product.price)}</span>
          {product.oldPrice && product.oldPrice > product.price && (
            <span className="text-sm text-neutral-400 line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
