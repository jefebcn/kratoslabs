import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CURRENCIES } from "@/lib/constants";
import type { CurrencyCode } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatta centesimi in euro. I soldi restano interi fino al render. */
export function formatPrice(cents: number, locale = "it-IT") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

/**
 * Formatta un importo (in centesimi di euro) nella valuta scelta.
 * La conversione è solo visiva: il prezzo canonico resta in centesimi di euro.
 */
export function formatMoney(eurCents: number, currency: CurrencyCode = "EUR") {
  const meta = CURRENCIES[currency] ?? CURRENCIES.EUR!;
  const converted = (eurCents / 100) * meta.rateFromEur;
  return new Intl.NumberFormat(meta.locale, {
    style: "currency",
    currency: meta.code,
  }).format(converted);
}

/**
 * Prezzo per grammo di principio attivo.
 * Il vero metro di paragone tra prodotti: due proteine allo stesso prezzo
 * non costano lo stesso se una ne contiene 25 g per porzione e l'altra 18 g.
 */
export function pricePerActiveGram(
  priceCents: number,
  activePerServingG: number,
  servingsPerContainer: number,
) {
  const totalActiveG = activePerServingG * servingsPerContainer;
  if (totalActiveG <= 0) return null;
  return priceCents / 100 / totalActiveG;
}

export function formatPricePerActiveGram(
  priceCents: number,
  activePerServingG: number,
  servingsPerContainer: number,
) {
  const value = pricePerActiveGram(
    priceCents,
    activePerServingG,
    servingsPerContainer,
  );
  if (value === null) return null;
  return `${value.toFixed(3).replace(".", ",")} €/g`;
}

/**
 * Variante valuta-aware del prezzo per grammo, per l'uso lato client dove
 * l'utente ha scelto una valuta diversa dall'euro.
 */
export function formatPricePerActiveGramIn(
  priceCents: number,
  activePerServingG: number,
  servingsPerContainer: number,
  currency: CurrencyCode = "EUR",
) {
  const value = pricePerActiveGram(
    priceCents,
    activePerServingG,
    servingsPerContainer,
  );
  if (value === null) return null;
  const meta = CURRENCIES[currency] ?? CURRENCIES.EUR!;
  const converted = value * meta.rateFromEur;
  return `${meta.symbol}${converted.toFixed(3).replace(".", ",")}/g`;
}

export function pricePerServing(priceCents: number, servings: number) {
  if (servings <= 0) return null;
  return Math.round(priceCents / servings);
}

/** Percentuale di sconto tra prezzo pieno e prezzo attuale, arrotondata. */
export function discountPct(priceCents: number, compareAtCents?: number) {
  if (!compareAtCents || compareAtCents <= priceCents) return null;
  return Math.round(((compareAtCents - priceCents) / compareAtCents) * 100);
}

export function formatDate(iso: string, locale = "it-IT") {
  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
