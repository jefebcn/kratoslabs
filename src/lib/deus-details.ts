/**
 * Genera la "scheda estesa" (pagina descrittiva) di un prodotto Deus Medical a
 * partire dal principio attivo e dalla categoria, in tutte le lingue.
 *
 * Contenuti FATTUALI e conformi: identità, classe farmacologica, meccanismo
 * d'azione descritto in modo neutro, caratteristiche, qualità e disclaimer.
 * NESSUN dosaggio, protocollo o consiglio medico. Il testo prodotto usa solo i
 * tag ammessi dalla scheda (h2/p/ul/li/strong).
 */

import DETAILS from "./deus-details-i18n.json";

export interface DetailsInput {
  title: string;
  category: string;
  activeName: string;
  packaging?: string;
}

interface DetailTable {
  headings: Record<string, string>;
  labels: Record<string, string>;
  forms: Record<string, string>;
  lead: string;
  qualityBody: string;
  noteBody: string;
  classLabels: Record<string, string>;
  explain: Record<string, string>;
}

const T = DETAILS as unknown as Record<string, DetailTable>;
export const DETAILS_LOCALES = ["it", "en", "de", "fr", "pt"] as const;

type FormKey = "injection" | "tablets" | "vial" | "pen" | "raw";

/** Forma (chiave localizzabile) dal testo confezione + categoria. */
function detectFormKey(packaging: string, category: string): FormKey {
  const p = packaging.toLowerCase();
  if (/penna|\bpen\b|cartucc/.test(p)) return "pen";
  if (/flacon|vial|liofil/.test(p)) return "vial";
  if (
    /fial|iniett|sterile|i\.m|soluzione|mg\/ml|\/\s*1?\s*ml/.test(p) ||
    category === "iniettabili"
  )
    return "injection";
  if (
    /compress|blister|tab|orale|capsul|bustine/.test(p) ||
    category === "orali" ||
    category === "sarms"
  )
    return "tablets";
  return "raw";
}

/** Concentrazione (es. "250 mg/ml", "40 mcg/tab") dal nome del principio attivo. */
function detectConcentration(activeName: string): string {
  const m = activeName.match(
    /(\d+(?:[.,]\d+)?)\s*(mg|mcg|µg|iu|ui)\s*\/\s*(ml|tab|compressa|cap|pen|die)/i,
  );
  if (m && m[1] && m[2] && m[3])
    return `${m[1]} ${m[2].toLowerCase()}/${m[3].toLowerCase()}`;
  const m2 = activeName.match(/(\d+(?:[.,]\d+)?)\s*(mg|mcg|iu|ui)\b/i);
  return m2 && m2[1] && m2[2] ? `${m2[1]} ${m2[2].toLowerCase()}` : "";
}

/** Regole di classificazione (prima corrispondenza vince) su titolo + attivo. */
const RULES: { re: RegExp; key: string }[] = [
  { re: /batteriostatic|watermed/i, key: "water" },
  { re: /anastrozol|letrozol|exemestan|aromasin|arimidex|femara/i, key: "aromatase-inhibitor" },
  { re: /tamoxifen|clomif|clomiphen|toremifen|raloxifen|nolvadex/i, key: "serm" },
  { re: /menopausal|\bhmg\b/i, key: "hmg" },
  { re: /chorionic|\bhcg\b|gonadotropin/i, key: "hcg" },
  { re: /cabergolin|dostinex/i, key: "dopamine-agonist" },
  { re: /clenbuterol/i, key: "beta2" },
  { re: /liothyronin|triiodothyron|levothyroxin|thyroxin|\bt3\b|\bt4\b/i, key: "thyroid" },
  { re: /semaglutid|tirzepatid|liraglutid|retatrutid/i, key: "glp1" },
  { re: /dapoxetin/i, key: "dapoxetine" },
  { re: /tadalafil|sildenafil|vardenafil/i, key: "pde5" },
  { re: /fragment|176-191/i, key: "peptide" },
  { re: /somatropin|growth hormone|\bhgh\b/i, key: "hgh" },
  { re: /ibutamoren|mk-?677|mk 677/i, key: "gh-secretagogue" },
  { re: /cardarine|gw-?501516|gw 501516/i, key: "ppar-delta" },
  { re: /erythropoietin|\bepo\b/i, key: "epo" },
  { re: /ostarine|mk-?2866|ligandrol|lgd-?4033|testolone|rad-?140|andarine|\bs-?4\b|\bs-?23\b|yk-?11|stenabolic|sr-?9009/i, key: "sarm" },
  { re: /pitavastatin|atorvastatin|rosuvastatin|simvastatin/i, key: "statin" },
  { re: /ezetimibe/i, key: "ezetimibe" },
  { re: /telmisartan|sartan/i, key: "arb" },
  { re: /nebivolol|bisoprolol/i, key: "beta-blocker" },
  { re: /peptide|ipamorelin|\bcjc\b|tesamorelin|ghrp|hexarelin|\bbpc\b|tb-?500|melanotan|pt-?141|\bigf\b|\bmgf\b|epithal|dsip|selank|semax|ghk|mots|thymosin|thymalin|follistatin|\bpnc\b|mod grf|\bgrf\b/i, key: "peptide" },
  { re: /testosteron|nandrolon|trenbolon|drostanolon|boldenon|methandien|methandrostenolon|methenolon|oxandrolon|stanozolol|oxymetholon|mesterolon|fluoxymesteron|dihydroboldenon|\bdhb\b|dianabol|sustanon|chlorodehydromethyltestosterone|methyldrostanolon|trestolon/i, key: "STEROID" },
];

function classifyKey(text: string, injectable: boolean): string {
  for (const rule of RULES) {
    if (rule.re.test(text)) {
      if (rule.key === "STEROID")
        return injectable ? "steroid-injectable" : "steroid-oral";
      return rule.key;
    }
  }
  return "generic";
}

/** Escape per il testo (nodi di testo): solo &, <, >. */
function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

/** HTML della scheda estesa per la lingua indicata (fallback su italiano). */
export function detailsHtml(input: DetailsInput, locale = "it"): string {
  const t = T[locale] ?? T.it!;
  const packaging = (input.packaging || "").replace(/\.\s*$/, "");
  const formKey = detectFormKey(input.packaging || "", input.category);
  const injectable =
    formKey === "injection" || formKey === "vial" || formKey === "pen";
  const key = classifyKey(`${input.title} ${input.activeName}`, injectable);
  const classLabel = t.classLabels[key] ?? t.classLabels.generic!;
  const explain = t.explain[key] ?? t.explain.generic!;
  const conc = detectConcentration(input.activeName);
  const L = t.labels;
  const H = t.headings;

  const lead = t.lead
    .replace(/\{title\}/g, input.title)
    .replace(/\{class\}/g, classLabel)
    .replace(/\{active\}/g, input.activeName);

  const items: string[] = [
    `<li><strong>${esc(L.active!)}:</strong> ${esc(input.activeName)}</li>`,
    `<li><strong>${esc(L.class!)}:</strong> ${esc(cap(classLabel))}</li>`,
    `<li><strong>${esc(L.form!)}:</strong> ${esc(t.forms[formKey]!)}</li>`,
  ];
  if (conc)
    items.push(
      `<li><strong>${esc(L.concentration!)}:</strong> ${esc(conc)}</li>`,
    );
  if (packaging)
    items.push(`<li><strong>${esc(L.packaging!)}:</strong> ${esc(packaging)}</li>`);
  items.push(
    `<li><strong>${esc(L.manufacturer!)}:</strong> Deus Medical</li>`,
  );

  return [
    `<h2>${esc(H.overview!)}</h2>`,
    `<p>${esc(lead)}</p>`,
    `<h2>${esc(H.howItWorks!)}</h2>`,
    `<p>${esc(explain)}</p>`,
    `<h2>${esc(H.characteristics!)}</h2>`,
    `<ul>${items.join("")}</ul>`,
    `<h2>${esc(H.quality!)}</h2>`,
    `<p>${esc(t.qualityBody)}</p>`,
    `<h2>${esc(H.note!)}</h2>`,
    `<p>${esc(t.noteBody)}</p>`,
  ].join("");
}
