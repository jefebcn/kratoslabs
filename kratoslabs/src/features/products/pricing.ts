import { BULK_TIERS } from "@/lib/constants";
import type { BulkTier } from "@/types";

/** Sconto quantità applicabile a una data quantità (0 se nessuno). */
export function bulkDiscountFor(
  quantity: number,
  tiers: BulkTier[] = BULK_TIERS,
) {
  return tiers
    .filter((t) => quantity >= t.minQuantity)
    .reduce((max, t) => Math.max(max, t.discount), 0);
}

/** Prossima soglia non ancora raggiunta, per il messaggio "aggiungi N per...". */
export function nextBulkTier(
  quantity: number,
  tiers: BulkTier[] = BULK_TIERS,
): BulkTier | null {
  return tiers.find((t) => quantity < t.minQuantity) ?? null;
}

export interface LinePricing {
  /** Frazione di sconto applicata, es. 0.1. */
  discount: number;
  /** Totale a prezzo pieno. */
  grossCents: number;
  /** Totale scontato. */
  netCents: number;
  /** Risparmio in centesimi. */
  savedCents: number;
}

/** Calcolo del prezzo di una riga con sconto quantità. Soldi sempre interi. */
export function priceLine(
  unitPriceCents: number,
  quantity: number,
  tiers: BulkTier[] = BULK_TIERS,
): LinePricing {
  const discount = bulkDiscountFor(quantity, tiers);
  const grossCents = unitPriceCents * quantity;
  const netCents = Math.round(grossCents * (1 - discount));
  return { discount, grossCents, netCents, savedCents: grossCents - netCents };
}
