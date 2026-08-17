import type { Product } from "@/types";

/**
 * Pacchetti consigliati ("spesso acquistati insieme").
 *
 * Regole puramente indicative: per la categoria del prodotto visualizzato,
 * suggeriamo prodotti di categorie complementari che i clienti tendono ad
 * acquistare in abbinamento (es. un ciclo con il relativo supporto/PCT).
 * Non è un consiglio d'uso né un protocollo: è solo una comodità d'acquisto.
 */
const COMPLEMENTS: Record<string, string[]> = {
  iniettabili: ["post-cycle", "salute", "sex-support"],
  orali: ["post-cycle", "salute", "sex-support"],
  sarms: ["post-cycle", "salute"],
  "post-cycle": ["salute", "sex-support", "iniettabili"],
  "brucia-grassi": ["salute", "hgh-peptidi"],
  "hgh-peptidi": ["salute", "brucia-grassi"],
  "sex-support": ["salute", "iniettabili"],
  salute: ["iniettabili", "orali", "post-cycle"],
};

/** Categorie di ripiego quando la categoria non ha una regola dedicata. */
const FALLBACK = ["salute", "post-cycle"];

/** Ordine deterministico: prima i featured, poi prezzo crescente, poi slug. */
function pickBest(candidates: Product[]): Product | undefined {
  return [...candidates].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.priceCents !== b.priceCents) return a.priceCents - b.priceCents;
    return a.slug.localeCompare(b.slug);
  })[0];
}

/**
 * Costruisce un pacchetto consigliato per `anchor` a partire dal catalogo:
 * fino a `max` prodotti complementari, uno per categoria, disponibili a
 * magazzino e diversi dal prodotto corrente. Vuoto se non ci sono abbinamenti.
 */
export function buildBundle(
  anchor: Product,
  catalog: Product[],
  max = 2,
): Product[] {
  const wanted = COMPLEMENTS[anchor.category] ?? FALLBACK;
  const chosen: Product[] = [];
  const usedIds = new Set<string>([anchor.id]);

  const available = catalog.filter((p) => p.stock > 0 && !usedIds.has(p.id));

  for (const category of wanted) {
    if (chosen.length >= max) break;
    const inCategory = available.filter(
      (p) => p.category === category && !usedIds.has(p.id),
    );
    const best = pickBest(inCategory);
    if (best) {
      chosen.push(best);
      usedIds.add(best.id);
    }
  }

  // Riempi eventuali posti rimasti con altri prodotti disponibili (categoria
  // diversa dall'anchor), così il pacchetto ha comunque un abbinamento utile.
  if (chosen.length < max) {
    const extras = available.filter(
      (p) => p.category !== anchor.category && !usedIds.has(p.id),
    );
    for (const p of [...extras].sort((a, b) => a.priceCents - b.priceCents)) {
      if (chosen.length >= max) break;
      chosen.push(p);
      usedIds.add(p.id);
    }
  }

  return chosen;
}
