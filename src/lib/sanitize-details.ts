/**
 * Sanifica l'HTML della scheda prodotto importata dal browser. Mantiene solo
 * un insieme ristretto di tag di testo e rimuove TUTTI gli attributi (quindi
 * niente onclick/href/script/style). Robusto anche se la sorgente è ostile.
 */
const ALLOWED = new Set([
  "h2",
  "h3",
  "h4",
  "p",
  "ul",
  "ol",
  "li",
  "strong",
  "b",
  "em",
  "br",
]);

export function sanitizeDetails(input: string): string {
  if (!input) return "";
  let s = input;
  // Via interi blocchi pericolosi (contenuto incluso).
  s = s.replace(/<(script|style)[\s\S]*?<\/\1>/gi, "");
  s = s.replace(/<!--[\s\S]*?-->/g, "");
  // Per ogni tag: tieni solo il nome se in whitelist, senza attributi; gli
  // altri tag vengono rimossi lasciando il testo interno.
  s = s.replace(/<(\/?)([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g, (_m, slash, tag) => {
    const t = String(tag).toLowerCase();
    return ALLOWED.has(t) ? `<${slash}${t}>` : "";
  });
  // Comprimi spazi e righe vuote in eccesso.
  s = s.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
  return s.trim();
}
