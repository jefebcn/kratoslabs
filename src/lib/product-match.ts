/**
 * Abbina un nome prodotto "esterno" (es. da deuspower: "TESTOMED E 250
 * (Testosterone Enantato)") a uno slug del nostro catalogo, confrontando le
 * versioni "compatte" (solo lettere/numeri). Vince il titolo più lungo che è
 * prefisso del nome in ingresso, così "DIANAMED 100" batte "DIANAMED 10".
 */
export function compact(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

export function matchProductSlug(
  name: string,
  products: { slug: string; title: string }[],
): string | null {
  const nc = compact(name);
  if (!nc) return null;
  let best: { slug: string; len: number } | null = null;
  for (const p of products) {
    const tc = compact(p.title);
    if (!tc) continue;
    if (nc === tc || nc.startsWith(tc)) {
      if (!best || tc.length > best.len) best = { slug: p.slug, len: tc.length };
    }
  }
  return best?.slug ?? null;
}
