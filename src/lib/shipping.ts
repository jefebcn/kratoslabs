/**
 * Spedizione a tariffa unica. Costo fisso per ogni ordine, con soglia di
 * spedizione gratuita: sopra la soglia il costo è azzerato. Questa è l'unica
 * fonte di verità; il server ricalcola sempre il costo da qui (mai dal client).
 *
 * Il paese di destinazione serve solo per l'indirizzo di spedizione: non
 * influisce più sul costo (modello a tariffa unica).
 */

/** Costo di spedizione fisso, in centesimi (15,00 €). */
export const FLAT_SHIPPING_CENTS = 1500;

/** Soglia oltre la quale la spedizione è gratuita, in centesimi (180,00 €). */
export const FREE_SHIPPING_THRESHOLD_CENTS = 18000;

/** Importo minimo d'ordine (merce), in centesimi (75,00 €). */
export const MIN_ORDER_CENTS = 7500;

/**
 * Costo di spedizione per un dato subtotale merce (in centesimi).
 * Gratuita se il subtotale raggiunge la soglia, altrimenti tariffa fissa.
 */
export function shippingCentsFor(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : FLAT_SHIPPING_CENTS;
}

/**
 * Base per l'ordine minimo: merce + spedizione. L'importo minimo d'ordine
 * (75 €) si considera raggiunto sul totale comprensivo di spedizione.
 */
export function minimumBasisCents(subtotalCents: number): number {
  return subtotalCents + shippingCentsFor(subtotalCents);
}

/** true se l'ordine (merce + spedizione) raggiunge l'importo minimo. */
export function meetsMinimumOrder(subtotalCents: number): boolean {
  return minimumBasisCents(subtotalCents) >= MIN_ORDER_CENTS;
}

/** Quanto manca (in centesimi) alla spedizione gratuita; 0 se già raggiunta. */
export function remainingForFreeShipping(subtotalCents: number): number {
  return Math.max(0, FREE_SHIPPING_THRESHOLD_CENTS - subtotalCents);
}

/**
 * Quanto manca (in centesimi) all'ordine minimo; 0 se già raggiunto.
 * Calcolato sul totale comprensivo di spedizione (merce + spedizione).
 */
export function remainingForMinimumOrder(subtotalCents: number): number {
  return Math.max(0, MIN_ORDER_CENTS - minimumBasisCents(subtotalCents));
}

export interface ShippingCountry {
  /** Codice ISO 3166-1 alpha-2, usato come valore del <select>. */
  code: string;
  /** Nome mostrato (italiano). */
  name: string;
}

/** Paesi UE. */
const EU: ShippingCountry[] = [
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgio" },
  { code: "BG", name: "Bulgaria" },
  { code: "HR", name: "Croazia" },
  { code: "CY", name: "Cipro" },
  { code: "CZ", name: "Repubblica Ceca" },
  { code: "DK", name: "Danimarca" },
  { code: "EE", name: "Estonia" },
  { code: "FI", name: "Finlandia" },
  { code: "FR", name: "Francia" },
  { code: "DE", name: "Germania" },
  { code: "GR", name: "Grecia" },
  { code: "IE", name: "Irlanda" },
  { code: "IT", name: "Italia" },
  { code: "LV", name: "Lettonia" },
  { code: "LT", name: "Lituania" },
  { code: "LU", name: "Lussemburgo" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Paesi Bassi" },
  { code: "PL", name: "Polonia" },
  { code: "PT", name: "Portogallo" },
  { code: "RO", name: "Romania" },
  { code: "SK", name: "Slovacchia" },
  { code: "SI", name: "Slovenia" },
  { code: "ES", name: "Spagna" },
  { code: "SE", name: "Svezia" },
  { code: "HU", name: "Ungheria" },
];

/** Resto d'Europa, extra-UE. */
const EUROPE: ShippingCountry[] = [
  { code: "AL", name: "Albania" },
  { code: "AD", name: "Andorra" },
  { code: "BA", name: "Bosnia ed Erzegovina" },
  { code: "GE", name: "Georgia" },
  { code: "IS", name: "Islanda" },
  { code: "LI", name: "Liechtenstein" },
  { code: "MK", name: "Macedonia del Nord" },
  { code: "MD", name: "Moldavia" },
  { code: "MC", name: "Monaco" },
  { code: "ME", name: "Montenegro" },
  { code: "NO", name: "Norvegia" },
  { code: "GB", name: "Regno Unito" },
  { code: "SM", name: "San Marino" },
  { code: "RS", name: "Serbia" },
  { code: "CH", name: "Svizzera" },
  { code: "TR", name: "Turchia" },
  { code: "UA", name: "Ucraina" },
  { code: "VA", name: "Città del Vaticano" },
];

/** Stati Uniti. */
const USA: ShippingCountry[] = [{ code: "US", name: "Stati Uniti" }];

/** Fallback per ogni altra destinazione. */
const WORLD: ShippingCountry[] = [
  { code: "ZZ", name: "Altro paese (extra-Europa)" },
];

export const SHIPPING_COUNTRIES: ShippingCountry[] = [
  ...EU,
  ...EUROPE,
  ...USA,
  ...WORLD,
];
