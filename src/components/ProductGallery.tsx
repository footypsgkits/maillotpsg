"use client";

import { useState } from "react";
import Image from "next/image";

type Img = { url: string; alt: string | null };

export function ProductGallery({ images, alt }: { images: Img[]; alt: string }) {
  const [activeIdx, setActiveIdx] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-neutral-100 rounded-2xl grid place-items-center text-neutral-400">
        Aucune image
      </div>
    );
  }

  const main = images[activeIdx] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="aspect-square bg-neutral-100 rounded-2xl overflow-hidden">
        <Image
          src={main.url}
          alt={main.alt ?? alt}
          width={900}
          height={900}
          sizes="(max-width: 1024px) 100vw, 600px"
          className="w-full h-full object-cover"
          priority
          {...(main.url.startsWith("http") ? { unoptimized: true } : {})}
        />
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 8).map((img, i) => {
            const isActive = i === activeIdx;
            return (
              <button
                key={i}
                type="button"
                onClick={() => setActiveIdx(i)}
                aria-label={`Voir image ${i + 1}`}
                aria-current={isActive}
                className={`aspect-square bg-neutral-100 rounded-lg overflow-hidden ring-2 transition ${
                  isActive ? "ring-psg-red" : "ring-transparent hover:ring-neutral-300"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.alt ?? alt}
                  width={200}
                  height={200}
                  sizes="120px"
                  className="w-full h-full object-cover"
                  {...(img.url.startsWith("http") ? { unoptimized: true } : {})}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
