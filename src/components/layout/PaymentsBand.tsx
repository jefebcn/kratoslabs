"use client";

import { useEffect, useState } from "react";
import {
  Bitcoin,
  CircleDollarSign,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { ACCEPTED_PAYMENTS } from "@/lib/constants";

const ICONS: Record<string, LucideIcon> = {
  Bitcoin,
  CircleDollarSign,
  Landmark,
};

/**
 * Banda "Accettiamo" scura, con il metodo di pagamento che ruota
 * (icona + nome + sottotitolo), stile competitor ma sui metodi reali.
 */
export function PaymentsBand() {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const n = ACCEPTED_PAYMENTS.length;

  useEffect(() => {
    if (reduce || n <= 1) return;
    const t = setInterval(() => setIndex((p) => (p + 1) % n), 2800);
    return () => clearInterval(t);
  }, [reduce, n]);

  const item = ACCEPTED_PAYMENTS[index]!;
  const Icon = ICONS[item.icon] ?? Bitcoin;

  return (
    <section className="border-y border-black/10 bg-[#15181d] text-white">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
          Accettiamo
        </span>
        <span className="h-6 w-px shrink-0 bg-white/15" />

        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div
            key={index}
            className="animate-fade-in flex items-center gap-3"
            aria-live="polite"
          >
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-white/10 text-accent">
              <Icon className="size-4" aria-hidden />
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-semibold uppercase tracking-wide">
                {item.name}
              </p>
              <p className="truncate text-xs text-white/55">{item.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Puntini indicatori */}
        <div className="hidden shrink-0 items-center gap-1.5 sm:flex">
          {ACCEPTED_PAYMENTS.map((p, i) => (
            <span
              key={p.name}
              className={
                i === index
                  ? "h-1.5 w-4 rounded-full bg-accent transition-all"
                  : "h-1.5 w-1.5 rounded-full bg-white/25 transition-all"
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
