"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function MegaMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "inline-flex items-center gap-1 py-2 text-sm font-medium transition-colors",
          open ? "text-accent" : "text-text hover:text-accent",
        )}
      >
        Categorie
        <ChevronDown
          className={cn("size-4 transition-transform", open && "rotate-180")}
          aria-hidden
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-40 pt-2">
          <div className="w-[min(90vw,640px)] rounded-base border border-border bg-surface p-2 shadow-2xl [animation:kl-zoom-in_150ms_var(--ease-out-expo)]">
            <div className="grid grid-cols-2 gap-1">
              {CATEGORIES.map((c) => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  onClick={() => setOpen(false)}
                  className="group flex flex-col gap-0.5 rounded-[3px] p-3 transition-colors hover:bg-surface-2"
                >
                  <span className="text-sm font-medium transition-colors group-hover:text-accent">
                    {c.name}
                  </span>
                  <span className="text-xs text-muted">{c.description}</span>
                </Link>
              ))}
            </div>
            <div className="mt-1 border-t border-border p-3">
              <Link
                href="/products"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-accent hover:underline"
              >
                Vedi tutto il catalogo →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
