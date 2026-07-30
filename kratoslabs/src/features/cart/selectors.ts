"use client";

import { useMemo } from "react";
import { priceLine } from "@/features/products/pricing";
import { useCart } from "./store";

/** Numero totale di pezzi nel carrello. */
export function useCartCount() {
  const lines = useCart((s) => s.lines);
  return useMemo(() => lines.reduce((n, l) => n + l.quantity, 0), [lines]);
}

export interface CartSummary {
  itemCount: number;
  subtotalGrossCents: number;
  subtotalNetCents: number;
  discountCents: number;
}

/**
 * Riepilogo del carrello con sconti quantità applicati per riga.
 * Selezioniamo solo `lines` (riferimento stabile) e deriviamo con useMemo,
 * così non creiamo un nuovo oggetto snapshot a ogni render.
 */
export function useCartSummary(): CartSummary {
  const lines = useCart((s) => s.lines);
  return useMemo(() => {
    let subtotalGrossCents = 0;
    let subtotalNetCents = 0;
    let itemCount = 0;
    for (const line of lines) {
      const priced = priceLine(line.unitPriceCents, line.quantity);
      subtotalGrossCents += priced.grossCents;
      subtotalNetCents += priced.netCents;
      itemCount += line.quantity;
    }
    return {
      itemCount,
      subtotalGrossCents,
      subtotalNetCents,
      discountCents: subtotalGrossCents - subtotalNetCents,
    };
  }, [lines]);
}
