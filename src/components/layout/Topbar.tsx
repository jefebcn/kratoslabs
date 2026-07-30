"use client";

import { useEffect, useState } from "react";
import { FlaskConical, RotateCcw, Truck, type LucideIcon } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { ANNOUNCEMENTS } from "@/lib/constants";
import { Meander } from "@/components/ui/Meander";

const ICONS: LucideIcon[] = [FlaskConical, Truck, RotateCcw];

/** Barra annunci che ruota su una sola riga (niente wrap su mobile). */
export function Topbar() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const n = ANNOUNCEMENTS.length;

  useEffect(() => {
    if (reduce || n <= 1) return;
    const t = setInterval(() => setIndex((p) => (p + 1) % n), 3500);
    return () => clearInterval(t);
  }, [reduce, n]);

  const Icon = ICONS[index] ?? FlaskConical;

  return (
    <div className="border-b border-border bg-surface">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-center gap-3 px-4 text-xs text-muted sm:gap-4">
        <Meander units={3} className="hidden text-accent/60 sm:block" />
        <span
          key={index}
          className="animate-fade-in inline-flex min-w-0 items-center gap-1.5 truncate font-medium"
        >
          <Icon className="size-3.5 shrink-0 text-accent" aria-hidden />
          <span className="truncate">{ANNOUNCEMENTS[index]}</span>
        </span>
        <Meander units={3} className="hidden text-accent/60 sm:block" />
      </div>
    </div>
  );
}
