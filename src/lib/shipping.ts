/**
 * Tariffe di spedizione per zona. Modello a zone (nessuna soglia di spedizione
 * gratuita): il costo dipende dal paese di destinazione. Questa è l'unica fonte
 * di verità; il server ricalcola sempre il costo da qui (mai dal client).
 */

export type ShippingZoneId = "eu" | "europe" | "usa" | "world";

export interface ShippingZone {
  id: ShippingZoneId;
  cents: number;
  /** Chiave i18n dell'etichetta (namespace `checkout.zones`). */
  labelKey: ShippingZoneId;
}

export const SHIPPING_ZONES: Record<ShippingZoneId, ShippingZone> = {
  eu: { id: "eu", cents: 2200, labelKey: "eu" },
  europe: { id: "europe", cents: 2800, labelKey: "europe" },
  usa: { id: "usa", cents: 3000, labelKey: "usa" },
  world: { id: "world", cents: 3000, labelKey: "world" },
};

export interface ShippingCountry {
  /** Codice ISO 3166-1 alpha-2, usato come valore del <select>. */
  code: string;
  /** Nome mostrato (italiano). */
  name: string;
  zone: ShippingZoneId;
}

/** Paesi UE (22 €). */
const EU: ShippingCountry[] = [
  { code: "AT", name: "Austria", zone: "eu" },
  { code: "BE", name: "Belgio", zone: "eu" },
  { code: "BG", name: "Bulgaria", zone: "eu" },
  { code: "HR", name: "Croazia", zone: "eu" },
  { code: "CY", name: "Cipro", zone: "eu" },
  { code: "CZ", name: "Repubblica Ceca", zone: "eu" },
  { code: "DK", name: "Danimarca", zone: "eu" },
  { code: "EE", name: "Estonia", zone: "eu" },
  { code: "FI", name: "Finlandia", zone: "eu" },
  { code: "FR", name: "Francia", zone: "eu" },
  { code: "DE", name: "Germania", zone: "eu" },
  { code: "GR", name: "Grecia", zone: "eu" },
  { code: "IE", name: "Irlanda", zone: "eu" },
  { code: "IT", name: "Italia", zone: "eu" },
  { code: "LV", name: "Lettonia", zone: "eu" },
  { code: "LT", name: "Lituania", zone: "eu" },
  { code: "LU", name: "Lussemburgo", zone: "eu" },
  { code: "MT", name: "Malta", zone: "eu" },
  { code: "NL", name: "Paesi Bassi", zone: "eu" },
  { code: "PL", name: "Polonia", zone: "eu" },
  { code: "PT", name: "Portogallo", zone: "eu" },
  { code: "RO", name: "Romania", zone: "eu" },
  { code: "SK", name: "Slovacchia", zone: "eu" },
  { code: "SI", name: "Slovenia", zone: "eu" },
  { code: "ES", name: "Spagna", zone: "eu" },
  { code: "SE", name: "Svezia", zone: "eu" },
  { code: "HU", name: "Ungheria", zone: "eu" },
];

/** Resto d'Europa, extra-UE (28 €). */
const EUROPE: ShippingCountry[] = [
  { code: "AL", name: "Albania", zone: "europe" },
  { code: "AD", name: "Andorra", zone: "europe" },
  { code: "BA", name: "Bosnia ed Erzegovina", zone: "europe" },
  { code: "GE", name: "Georgia", zone: "europe" },
  { code: "IS", name: "Islanda", zone: "europe" },
  { code: "LI", name: "Liechtenstein", zone: "europe" },
  { code: "MK", name: "Macedonia del Nord", zone: "europe" },
  { code: "MD", name: "Moldavia", zone: "europe" },
  { code: "MC", name: "Monaco", zone: "europe" },
  { code: "ME", name: "Montenegro", zone: "europe" },
  { code: "NO", name: "Norvegia", zone: "europe" },
  { code: "GB", name: "Regno Unito", zone: "europe" },
  { code: "SM", name: "San Marino", zone: "europe" },
  { code: "RS", name: "Serbia", zone: "europe" },
  { code: "CH", name: "Svizzera", zone: "europe" },
  { code: "TR", name: "Turchia", zone: "europe" },
  { code: "UA", name: "Ucraina", zone: "europe" },
  { code: "VA", name: "Città del Vaticano", zone: "europe" },
];

/** Stati Uniti (30 €). */
const USA: ShippingCountry[] = [
  { code: "US", name: "Stati Uniti", zone: "usa" },
];

/** Fallback per ogni altra destinazione (30 €). */
const WORLD: ShippingCountry[] = [
  { code: "ZZ", name: "Altro paese (extra-Europa)", zone: "world" },
];

export const SHIPPING_COUNTRIES: ShippingCountry[] = [
  ...EU,
  ...EUROPE,
  ...USA,
  ...WORLD,
];

const BY_CODE = new Map(
  SHIPPING_COUNTRIES.map((c) => [c.code.toUpperCase(), c] as const),
);
const BY_NAME = new Map(
  SHIPPING_COUNTRIES.map(
    (c) => [c.name.toLowerCase(), c] as const,
  ),
);

/**
 * Zona di spedizione a partire dal valore del campo "country" (codice ISO o
 * nome). Qualsiasi valore non riconosciuto ricade nella zona `world` (30 €),
 * così un ordine non resta mai senza costo di spedizione.
 */
export function zoneForCountry(country: string | null | undefined): ShippingZoneId {
  const raw = (country ?? "").trim();
  if (!raw) return "world";
  const byCode = BY_CODE.get(raw.toUpperCase());
  if (byCode) return byCode.zone;
  const byName = BY_NAME.get(raw.toLowerCase());
  if (byName) return byName.zone;
  return "world";
}

/** Costo di spedizione in centesimi per il paese indicato. */
export function shippingCentsForCountry(
  country: string | null | undefined,
): number {
  return SHIPPING_ZONES[zoneForCountry(country)].cents;
}

/** Tariffa minima (usata nelle sintesi "a partire da …"). */
export const SHIPPING_FROM_CENTS = Math.min(
  ...Object.values(SHIPPING_ZONES).map((z) => z.cents),
);
