import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function pricePerServing(priceCents: number, servings: number) {
  if (servings <= 0) return null;
  return Math.round(priceCents / servings);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
