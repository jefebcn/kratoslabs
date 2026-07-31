"use client";

import { useState } from "react";
import Image from "next/image";
import { ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Lightbox } from "@/components/ui/Lightbox";

export function ProductGallery({
  images,
}: {
  images: { url: string; alt: string }[];
}) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const main = images[active] ?? images[0];

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => main && setZoom(true)}
        aria-label="Ingrandisci immagine"
        className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-base border border-border bg-surface-2"
      >
        {main && (
          <Image
            src={main.url}
            alt={main.alt}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 45vw"
            className="object-cover"
          />
        )}
        <span className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100">
          <ZoomIn className="size-4" aria-hidden />
        </span>
      </button>

      {zoom && (
        <Lightbox
          images={images}
          index={active}
          onIndex={setActive}
          onClose={() => setZoom(false)}
        />
      )}

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <button
              key={`${img.url}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Mostra immagine ${i + 1}`}
              aria-current={i === active}
              className={cn(
                "relative aspect-square overflow-hidden rounded-base border bg-surface-2 transition-colors",
                i === active
                  ? "border-accent"
                  : "border-border hover:border-muted",
              )}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="20vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
