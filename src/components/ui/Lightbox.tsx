"use client";

import { useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Img = { url: string; alt: string };

/**
 * Visualizzatore a schermo intero: mostra la foto selezionata ingrandita, con
 * frecce/tastiera per scorrere e chiusura con Esc, click sullo sfondo o X.
 */
export function Lightbox({
  images,
  index,
  onIndex,
  onClose,
}: {
  images: Img[];
  index: number;
  onIndex: (i: number) => void;
  onClose: () => void;
}) {
  const n = images.length;
  const cur = images[index] ?? images[0];
  const prev = useCallback(
    () => onIndex((index - 1 + n) % n),
    [index, n, onIndex],
  );
  const next = useCallback(() => onIndex((index + 1) % n), [index, n, onIndex]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, prev, next]);

  if (!cur) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
      >
        <X className="size-5" aria-hidden />
      </button>

      {n > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
          aria-label="Precedente"
          className="absolute left-3 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
        >
          <ChevronLeft className="size-6" aria-hidden />
        </button>
      )}

      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={cur.url}
        alt={cur.alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[92vw] rounded-base object-contain shadow-2xl"
      />

      {n > 1 && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
          aria-label="Successiva"
          className="absolute right-3 grid size-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
        >
          <ChevronRight className="size-6" aria-hidden />
        </button>
      )}

      {n > 1 && (
        <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-3 py-1 text-sm text-white">
          {index + 1} / {n}
        </span>
      )}
    </div>
  );
}
