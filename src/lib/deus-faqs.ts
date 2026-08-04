/**
 * Genera le FAQ di un prodotto Deus Medical a partire dal principio attivo.
 * Le domande/risposte vivono in `deus-faqs-library.json` (una serie per classe
 * farmacologica) con segnaposto {title} {active} {form} {concentration}
 * {packaging} {class} che vengono riempiti qui. Contenuti FATTUALI e neutri:
 * nessun dosaggio, protocollo o claim di efficacia (coerente con le descrizioni).
 */

import LIB from "./deus-faqs-library.json";
import type { EnrichInput, EnrichedSpecs } from "./deus-descriptions";
import type { ProductFaq } from "@/types";

export type FaqClassKey =
  | "aromatase-inhibitor"
  | "serm"
  | "hcg"
  | "dopamine-agonist"
  | "beta2"
  | "thyroid"
  | "glp1"
  | "pde5"
  | "hgh"
  | "gh-secretagogue"
  | "ppar-delta"
  | "sarm"
  | "peptide"
  | "steroid-injectable"
  | "steroid-oral"
  | "generic";

/**
 * Classifica il principio attivo in una chiave della libreria FAQ.
 * Le regex rispecchiano quelle di `deus-descriptions.ts` (prima vince).
 */
export function classKeyFor(
  activeName: string,
  injectable: boolean,
  category: string,
): FaqClassKey {
  const s = activeName;
  if (/anastrozol|letrozol|exemestan|aromasin|arimidex|femara/i.test(s))
    return "aromatase-inhibitor";
  if (/tamoxifen|clomif|clomiphen|toremifen|raloxifen|nolvadex/i.test(s))
    return "serm";
  if (/chorionic|hcg|gonadotropin/i.test(s)) return "hcg";
  if (/cabergolin|dostinex/i.test(s)) return "dopamine-agonist";
  if (/clenbuterol/i.test(s)) return "beta2";
  if (/liothyronin|triiodothyron|\bt3\b|levothyroxin|thyroxin|\bt4\b/i.test(s))
    return "thyroid";
  if (/semaglutid|tirzepatid|liraglutid|retatrutid/i.test(s)) return "glp1";
  if (/tadalafil|sildenafil|vardenafil/i.test(s)) return "pde5";
  if (/somatropin|growth hormone|\bhgh\b|\bgh\b/i.test(s)) return "hgh";
  if (/ibutamoren|mk-?677|mk 677/i.test(s)) return "gh-secretagogue";
  if (/cardarine|gw-?501516|gw 501516/i.test(s)) return "ppar-delta";
  if (
    /ostarine|mk-?2866|ligandrol|lgd-?4033|testolone|rad-?140|andarine|\bs-?4\b|yk-?11|stenabolic|sr-?9009|sarm/i.test(
      s,
    )
  )
    return "sarm";
  if (
    /peptide|ipamorelin|cjc|tesamorelin|ghrp|bpc|tb-?500|melanotan|pt-?141/i.test(
      s,
    )
  )
    return "peptide";
  if (
    /testosteron|nandrolon|trenbolon|drostanolon|boldenon|methandien|methandrostenolon|methenolon|oxandrolon|stanozolol|oxymetholon|mesterolon|fluoxymesteron|dihydroboldenon|\bdhb\b|dianabol|sustanon/i.test(
      s,
    )
  )
    return injectable ? "steroid-injectable" : "steroid-oral";
  if (category === "iniettabili") return "steroid-injectable";
  if (category === "orali" || category === "sarms") return "steroid-oral";
  return "generic";
}

/** Lingue supportate dalla libreria FAQ. */
export const FAQ_LOCALES = ["it", "en", "de", "fr", "pt"] as const;

// Libreria: locale -> classe -> FAQ[]. (Cast via unknown: la forma del JSON
// evolve — vedi deus-faqs-library.json con chiavi di lingua al primo livello.)
const LIBRARY = LIB as unknown as Record<
  string,
  Record<string, ProductFaq[]>
>;

/** FAQ pronte per un prodotto in una lingua (segnaposto già riempiti). */
export function faqsForProduct(
  p: EnrichInput,
  specs: EnrichedSpecs,
  locale: string = "it",
): ProductFaq[] {
  const injectable = /iniett|penna|flacon/i.test(specs.form);
  const key = classKeyFor(p.activeName, injectable, p.category);
  const byClass = LIBRARY[locale] ?? LIBRARY.it ?? {};
  const template = byClass[key] ?? byClass.generic ?? [];

  const vars: Record<string, string> = {
    title: p.title,
    active: p.activeName,
    form: specs.form || "—",
    concentration: specs.concentration || "—",
    packaging: (specs.packaging || "—").replace(/\.\s*$/, ""),
    class: specs.productClass || "prodotto Deus Medical",
  };
  const fill = (t: string) =>
    t.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? `{${k}}`);

  return template.map((f) => ({ q: fill(f.q), a: fill(f.a) }));
}

/** FAQ in tutte le lingue: { it: [...], en: [...], ... }. */
export function faqsI18nForProduct(
  p: EnrichInput,
  specs: EnrichedSpecs,
): Record<string, ProductFaq[]> {
  return Object.fromEntries(
    FAQ_LOCALES.map((l) => [l, faqsForProduct(p, specs, l)]),
  );
}
