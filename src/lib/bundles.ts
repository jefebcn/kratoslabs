import type { Product } from "@/types";

/**
 * Pacchetti consigliati ("spesso acquistati insieme").
 *
 * Gli abbinamenti sono costruiti su base FUNZIONALE (forma del prodotto + ruolo)
 * e non semplicemente per categoria/prezzo, così le combo hanno senso:
 *  - l'acqua batteriostatica (WATERMED) è proposta SOLO per prodotti
 *    liofilizzati da ricostituire (peptidi, HGH, GLP-1 iniettabili, hCG/HMG),
 *    mai per orali (es. Clenbuterolo in compresse) o oli iniettabili pronti;
 *  - un ciclo (iniettabili/orali) è abbinato al supporto PCT (SERM + inibitore
 *    dell'aromatasi), non ad accessori;
 *  - i brucia-grassi orali (clen/T3/T4) si abbinano tra loro, non all'acqua.
 *
 * Non è un consiglio d'uso né un protocollo: è solo una comodità d'acquisto.
 */

type Form = "oral" | "oil" | "lyo" | "water";

function textOf(p: Product): string {
  const specs = p.specs ?? ({} as Product["specs"]);
  return [
    p.title,
    p.shortDescription,
    p.description,
    specs.activeName,
    specs.packaging ?? "",
    specs.form ?? "",
  ]
    .join(" ")
    .toLowerCase();
}

/** Forma del prodotto, dedotta dal confezionamento (indipendente dalla lingua). */
function formOf(p: Product): Form {
  const t = textOf(p);
  if (/batteriostatic|watermed/.test(t)) return "water";
  if (/flaconcin|vial|\bpen\b|\/pen|cartucc/.test(t)) return "lyo";
  if (/uso orale|compress|bustine|\btab\b|orale/.test(t)) return "oral";
  if (/soluzione sterile|i\.m\.|iniettabil/.test(t)) return "oil";
  return "oral";
}

/* Sotto-classificazioni per abbinamenti precisi. */
const isSerm = (p: Product) =>
  /tamoxifen|clomiphene|enclomiphene|raloxifene/.test(textOf(p));
const isAI = (p: Product) =>
  /anastrozole|exemestane|letrozole/.test(textOf(p));
const isGonadotropin = (p: Product) => /gonadotropin/.test(textOf(p)); // hCG, HMG
const isThyroid = (p: Product) =>
  /liothyronine|levothyroxine|\bt3\b|\bt4\b/.test(textOf(p));
const isClen = (p: Product) => /clenbuterol/.test(textOf(p));

type Pred = (p: Product) => boolean;

/** Predicati riutilizzabili sulle categorie/ruoli del catalogo. */
const P = {
  serm: (p: Product) => p.category === "post-cycle" && isSerm(p),
  ai: (p: Product) => p.category === "post-cycle" && isAI(p),
  hcg: (p: Product) => p.category === "post-cycle" && isGonadotropin(p),
  water: (p: Product) => formOf(p) === "water",
  peptideHeal: (p: Product) =>
    p.category === "hgh-peptidi" && /bpc|tb-?500|thymosin beta|ghk/.test(textOf(p)),
  peptideGH: (p: Product) =>
    p.category === "hgh-peptidi" &&
    /cjc|ipamorelin|ghrp|hexarelin|grf|sermorelin|somatropin|hgh/.test(textOf(p)),
  peptideAny: (p: Product) => p.category === "hgh-peptidi",
  fatloss: (p: Product) => p.category === "brucia-grassi",
  fatlossOral: (p: Product) =>
    p.category === "brucia-grassi" && formOf(p) !== "lyo",
  thyroid: (p: Product) => p.category === "brucia-grassi" && isThyroid(p),
  clen: (p: Product) => p.category === "brucia-grassi" && isClen(p),
  sarm: (p: Product) => p.category === "sarms",
  sex: (p: Product) => p.category === "sex-support",
  health: (p: Product) =>
    p.category === "salute" && formOf(p) !== "water",
} satisfies Record<string, Pred>;

/**
 * Elenco ordinato di predicati "cosa proporre" per un prodotto, secondo la sua
 * categoria e forma. I primi hanno priorità.
 */
function wantsFor(anchor: Product): Pred[] {
  const form = formOf(anchor);

  // L'acqua batteriostatica in sé → i prodotti che la richiedono.
  if (form === "water") return [P.peptideHeal, P.peptideGH, P.peptideAny];

  switch (anchor.category) {
    case "iniettabili":
    case "orali":
      // Ciclo → supporto PCT: SERM + inibitore dell'aromatasi (poi hCG).
      return [P.serm, P.ai, P.hcg];

    case "sarms":
      // SARM → mini-PCT (SERM) + un altro SARM di supporto.
      return [P.serm, P.sarm];

    case "hgh-peptidi":
      // Liofilizzato da ricostituire → acqua batteriostatica + peptide affine.
      if (P.peptideHeal(anchor)) return [P.water, P.peptideHeal, P.peptideGH];
      return [P.water, P.peptideGH, P.peptideAny];

    case "brucia-grassi":
      if (form === "lyo") {
        // GLP-1 iniettabile (semaglutide/tirzepatide/retatrutide) → acqua + affini.
        return [P.water, P.fatloss, P.health];
      }
      // Orali (clen/T3/T4): stack tra brucia-grassi, NIENTE acqua/accessori.
      if (isClen(anchor)) return [P.thyroid, P.fatlossOral];
      if (isThyroid(anchor)) return [P.clen, P.fatlossOral];
      return [P.fatlossOral];

    case "post-cycle":
      if (isGonadotropin(anchor)) return [P.water, P.serm]; // hCG/HMG liofilizzati
      if (isSerm(anchor)) return [P.ai, P.hcg];
      if (isAI(anchor)) return [P.serm, P.hcg];
      return [P.serm, P.ai];

    case "sex-support":
      if (form === "lyo") return [P.water, P.sex]; // PT-141 iniettabile
      return [P.sex];

    case "salute":
      return [P.health];

    default:
      return [P.serm];
  }
}

/** Miglior candidato per un predicato: in stock, prezzo > 0, deterministico. */
function bestMatch(
  catalog: Product[],
  anchor: Product,
  chosen: Set<string>,
  pred: Pred,
): Product | undefined {
  return catalog
    .filter(
      (p) =>
        p.id !== anchor.id &&
        !chosen.has(p.id) &&
        p.stock > 0 &&
        p.priceCents > 0 &&
        pred(p),
    )
    .sort((a, b) => a.priceCents - b.priceCents || a.slug.localeCompare(b.slug))[0];
}

/**
 * Costruisce un pacchetto consigliato per `anchor` a partire dal catalogo: fino
 * a `max` prodotti realmente complementari, secondo le regole funzionali sopra.
 * Nessun riempimento "col più economico": se non ci sono abbinamenti sensati,
 * torna vuoto e la sezione non viene mostrata.
 */
export function buildBundle(
  anchor: Product,
  catalog: Product[],
  max = 2,
): Product[] {
  const chosen: Product[] = [];
  const ids = new Set<string>([anchor.id]);

  for (const pred of wantsFor(anchor)) {
    if (chosen.length >= max) break;
    const match = bestMatch(catalog, anchor, ids, pred);
    if (match) {
      chosen.push(match);
      ids.add(match.id);
    }
  }

  return chosen;
}
