import { DEFAULT_LOCALE, LOCALES } from "@/lib/constants";
import type { LocaleCode } from "@/types";

/**
 * Scelta della lingua, per il sito e per le email ai clienti.
 *
 * Sito: lingua scelta a mano (cookie) → lingua del browser, se è una delle
 * nostre → inglese per chi ha un browser in un'altra lingua → italiano se il
 * browser non ne dichiara nessuna (es. motori di ricerca).
 *
 * Email: come il sito, ma se il browser non ha una delle nostre lingue si
 * guarda il paese di spedizione (un cliente in Germania riceve il tedesco).
 */

const SUPPORTED = LOCALES.map((l) => l.code) as LocaleCode[];

export function isLocale(v: unknown): v is LocaleCode {
  return typeof v === "string" && SUPPORTED.includes(v as LocaleCode);
}

/**
 * Lingue dell'header Accept-Language in ordine di preferenza (peso q), ridotte
 * alla lingua base: "de-AT,de;q=0.9,en;q=0.8" → ["de", "de", "en"].
 */
function browserLanguages(acceptLanguage: string | null | undefined): string[] {
  return (acceptLanguage ?? "")
    .split(",")
    .map((part, i) => {
      const [tag = "", ...params] = part.trim().split(";");
      const q = params
        .map((p) => p.trim())
        .find((p) => p.startsWith("q="));
      const weight = q ? Number.parseFloat(q.slice(2)) : 1;
      return {
        lang: tag.trim().toLowerCase().split("-")[0] ?? "",
        weight: Number.isFinite(weight) ? weight : 0,
        i,
      };
    })
    .filter((x) => x.lang && x.lang !== "*" && x.weight > 0)
    .sort((a, b) => b.weight - a.weight || a.i - b.i)
    .map((x) => x.lang);
}

/** Prima lingua del browser tra quelle del sito, o null se nessuna. */
export function supportedBrowserLocale(
  acceptLanguage: string | null | undefined,
): LocaleCode | null {
  return browserLanguages(acceptLanguage).find(isLocale) ?? null;
}

/** Lingua con cui mostrare il sito. */
export function siteLocale(
  cookieLocale: string | null | undefined,
  acceptLanguage: string | null | undefined,
): LocaleCode {
  if (isLocale(cookieLocale)) return cookieLocale;
  const fromBrowser = supportedBrowserLocale(acceptLanguage);
  if (fromBrowser) return fromBrowser;
  // Il browser dichiara lingue che non abbiamo: inglese. Nessuna lingua
  // dichiarata (crawler, client senza header): italiano.
  return browserLanguages(acceptLanguage).length > 0 ? "en" : DEFAULT_LOCALE;
}

/** Lingua più probabile per un paese di spedizione (codice ISO). */
export function localeForCountry(country: string | null | undefined): LocaleCode {
  switch ((country ?? "").trim().toUpperCase()) {
    case "IT":
    case "SM":
    case "VA":
      return "it";
    case "DE":
    case "AT":
    case "LI":
      return "de";
    case "FR":
    case "BE":
    case "LU":
    case "MC":
      return "fr";
    case "PT":
      return "pt";
    default:
      return "en";
  }
}

/** Lingua delle email per un ordine. */
export function emailLocale({
  cookieLocale,
  acceptLanguage,
  country,
}: {
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
  country?: string | null;
}): LocaleCode {
  if (isLocale(cookieLocale)) return cookieLocale;
  return supportedBrowserLocale(acceptLanguage) ?? localeForCountry(country);
}
