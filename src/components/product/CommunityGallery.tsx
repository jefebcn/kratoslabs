"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import type { GalleryImage } from "@/features/gallery/queries";

/**
 * "Galleria Touchdown": carosello orizzontale di foto/recensioni dei clienti.
 * Scorre in automatico (in pausa al passaggio del mouse) e mostra il testo
 * della recensione in overlay quando ci si passa sopra.
 */
export function CommunityGallery({ items }: { items: GalleryImage[] }) {
  const scroller = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  // Scorrimento automatico: avanza di una tessera ogni pochi secondi e riparte
  // dall'inizio alla fine. In pausa quando il mouse è sopra il carosello.
  useEffect(() => {
    if (items.length <= 1) return;
    const el = scroller.current;
    if (!el) return;
    const id = setInterval(() => {
      if (paused.current) return;
      const tile = el.querySelector("figure");
      const step = tile ? tile.clientWidth + 16 : Math.round(el.clientWidth * 0.8);
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 2) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: step, behavior: "smooth" });
      }
    }, 3500);
    return () => clearInterval(id);
  }, [items.length]);

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
        onMouseEnter={() => (paused.current = true)}
        onMouseLeave={() => (paused.current = false)}
        onTouchStart={() => (paused.current = true)}
        className="flex gap-4 overflow-x-auto scroll-smooth px-1 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((item) => (
          <Link
            key={item.id}
            href={`/testimonianze/${item.id}`}
            className="group relative block h-52 w-72 shrink-0 snap-start overflow-hidden rounded-base border border-border bg-surface-2 sm:h-60 sm:w-80"
          >
            <Image
              src={item.url}
              alt={item.alt}
              fill
              sizes="(max-width: 640px) 72vw, 320px"
              className="object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-accent/92 p-5 text-center text-sm font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <span className="flex flex-col items-center gap-2">
                {item.caption && <span className="text-pretty">{item.caption}</span>}
                <ArrowRight className="size-4" aria-hidden />
              </span>
            </span>
          </Link>
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
