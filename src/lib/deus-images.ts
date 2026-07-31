import "server-only";

/**
 * Localizza e scarica le foto prodotto ufficiali dal sito del produttore
 * DeusMedical (deusmedical.com), che espone una pagina per ogni prodotto con
 * lo stesso slug del nostro catalogo e l'immagine "front_<slug>". Usato dal
 * tool "Immagini" dell'admin per popolare rapidamente il catalogo.
 *
 * Nota: le immagini sono del produttore; usarle solo se autorizzati come
 * rivenditore. Il download avviene lato server (deusmedical.com risponde alle
 * richieste server; la fonte concorrente no, quindi non viene usata).
 */
const BASE = "https://deusmedical.com";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/151.0.0.0 Safari/537.36";

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA, "Accept-Language": "it" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

// Mappa slug -> URL pagina prodotto, in cache in memoria (per istanza server).
let mapCache: { map: Map<string, string>; ts: number } | null = null;
const TTL_MS = 10 * 60 * 1000;

async function slugMap(): Promise<Map<string, string>> {
  if (mapCache && Date.now() - mapCache.ts < TTL_MS) return mapCache.map;
  const html = await fetchText(`${BASE}/it/prodotti/`);
  const map = new Map<string, string>();
  for (const m of html.matchAll(/\/it\/prodotti\/[a-z0-9-]+\/([a-z0-9-]+)\//g)) {
    const slug = m[1];
    const full = m[0];
    if (slug && full && !map.has(slug)) map.set(slug, BASE + full);
  }
  mapCache = { map, ts: Date.now() };
  return map;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Sceglie l'URL della foto prodotto (preferisce "front_") dalla pagina. */
function pickImageUrl(html: string, slug: string): string | null {
  const token = slug.replace(/-/g, "_");
  const first = slug.split("-")[0] ?? slug;
  const junk =
    /logo|favicon|apple-icon|verify|verification|flag|payment|adobestock|deus_medical|placeholder/i;
  const urls = Array.from(
    html.matchAll(/\/images\/[^"'\s)>]+\.(?:webp|png|jpe?g)/gi),
  )
    .map((m) => m[0])
    .filter((u) => !junk.test(u));

  const abs = (u: string) => (u.startsWith("http") ? u : BASE + u);
  const pick =
    urls.find((u) => new RegExp(`front_${escapeRe(token)}\\.`, "i").test(u)) ||
    urls.find((u) => new RegExp(`(^|/|_)${escapeRe(token)}\\.`, "i").test(u)) ||
    urls.find((u) => new RegExp(`front_${escapeRe(first)}`, "i").test(u)) ||
    urls.find((u) => new RegExp(escapeRe(first), "i").test(u)) ||
    urls.find((u) => /\/images\/20\d\d\//.test(u));
  return pick ? abs(pick) : null;
}

/** Risolve l'URL dell'immagine ufficiale per uno slug prodotto (o null). */
export async function resolveDeusImageUrl(slug: string): Promise<string | null> {
  const map = await slugMap();
  const productUrl = map.get(slug);
  if (!productUrl) return null;
  const html = await fetchText(productUrl);
  return pickImageUrl(html, slug);
}

export interface DownloadedImage {
  contentType: string;
  ext: "png" | "webp" | "jpg";
  bytes: ArrayBuffer;
}

/** Scarica i byte di un'immagine da un URL (lato server). */
export async function downloadImage(url: string): Promise<DownloadedImage> {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`download HTTP ${res.status}`);
  const header = res.headers.get("content-type") || guessType(url);
  const contentType = header.split(";")[0] || guessType(url);
  if (!contentType.startsWith("image/")) {
    throw new Error("L'URL non è un'immagine.");
  }
  const bytes = await res.arrayBuffer();
  const ext = contentType.includes("png")
    ? "png"
    : contentType.includes("webp")
      ? "webp"
      : "jpg";
  return { contentType, ext, bytes };
}

function guessType(url: string): string {
  if (/\.png(\?|$)/i.test(url)) return "image/png";
  if (/\.webp(\?|$)/i.test(url)) return "image/webp";
  return "image/jpeg";
}
