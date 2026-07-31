"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { GalleryImage } from "@/features/gallery/queries";

/**
 * "Galleria Touchdown": carosello orizzontale di foto/recensioni dei clienti.
 * Al passaggio del mouse su una foto compare il testo della recensione.
 */
export function CommunityGallery({ items }: { items: GalleryImage[] }) {
  const scroller = useRef<HTMLDivElement>(null);

  if (items.length === 0) return null;

  function scroll(dir: 1 | -1) {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" });
  }

  return (
    <div className="relative">
      {items.length > 1 && (
        <button
          type="button"
          onClick={() => scroll(-1)}
          aria-label="Precedente"
          className="absolute left-0 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-accent text-white shadow-md transition-colors hover:bg-accent/90"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
      )}

      <div
        ref={scroller}
        className="flex gap-4 overflow-x-auto scroll-smooth px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <figure
            key={item.id}
            className="group relative h-52 w-72 shrink-0 snap-start overflow-hidden rounded-base border border-border bg-surface-2 sm:h-60 sm:w-80"
          >
            <Image
              src={item.url}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 72vw, 320px"
              className="object-cover"
            />
            {item.caption && (
              <figcaption className="absolute inset-0 flex items-center justify-center bg-accent/92 p-5 text-center text-sm font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                <span className="flex flex-col items-center gap-2">
                  <span className="text-pretty">{item.caption}</span>
                  <ArrowRight className="size-4" aria-hidden />
                </span>
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {items.length > 1 && (
        <button
          type="button"
          onClick={() => scroll(1)}
          aria-label="Successiva"
          className="absolute right-0 top-1/2 z-10 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-accent text-white shadow-md transition-colors hover:bg-accent/90"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>
      )}
    </div>
  );
}
