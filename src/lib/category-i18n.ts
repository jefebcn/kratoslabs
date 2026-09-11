import { CATEGORIES } from "@/lib/constants";

/**
 * Risoluzione del nome/sottotitolo di categoria mostrato ai clienti.
 *
 * Criterio (lo stesso usato per gli annunci del topbar): se l'admin ha
 * personalizzato il valore rispetto al default del catalogo, quel valore ha la
 * precedenza su ogni traduzione — così una rinomina dal pannello admin si vede
 * ovunque sul sito. Se invece il valore è ancora quello di default, mostriamo
 * la traduzione localizzata (namespace `productCategory`), con fallback al
 * valore del DB/catalogo.
 */

/** Default (seed) per ogni slug di categoria. */
const DEFAULT = new Map(CATEGORIES.map((c) => [c.slug, c]));

/** Traduttore next-intl del namespace `productCategory`. */
export interface CategoryTranslator {
  has: (key: string) => boolean;
  (key: string): string;
}

/**
 * Nome da mostrare per una categoria: nome personalizzato dall'admin se
 * rinominato, altrimenti la traduzione, con fallback al nome del DB/catalogo.
 */
export function categoryName(
  t: CategoryTranslator,
  slug: string,
  dbName: string,
): string {
  const def = DEFAULT.get(slug);
  const custom = !def || dbName.trim() !== def.name;
  if (custom) return dbName;
  return t.has(`${slug}.name`) ? t(`${slug}.name`) : dbName;
}

/**
 * Sottotitolo/descrizione da mostrare per una categoria: descrizione
 * personalizzata dall'admin se modificata, altrimenti la traduzione, con
 * fallback alla descrizione del DB/catalogo.
 */
export function categoryTagline(
  t: CategoryTranslator,
  slug: string,
  dbTagline: string,
): string {
  const def = DEFAULT.get(slug);
  const custom = !def || dbTagline.trim() !== def.description;
  if (custom) return dbTagline;
  return t.has(`${slug}.tagline`) ? t(`${slug}.tagline`) : dbTagline;
}
