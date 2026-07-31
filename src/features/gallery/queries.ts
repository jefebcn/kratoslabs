import { createReadClient } from "@/lib/supabase/read";
import { GALLERY_ITEMS } from "@/lib/constants";

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  /** Testo recensione mostrato in overlay al passaggio del mouse. */
  caption: string;
  rating: number;
  author: string;
  country: string;
  date: string;
  productSlugs: string[];
}

/** Fallback dal codice quando la tabella è vuota o non configurata. */
const FALLBACK: GalleryImage[] = GALLERY_ITEMS.map((g) => ({
  id: g.id,
  url: g.imageUrl,
  alt: g.alt,
  caption: g.author ? `${g.author}${g.location ? ` — ${g.location}` : ""}` : "",
  rating: 5,
  author: g.author ?? "",
  country: g.location ?? "",
  date: "",
  productSlugs: [],
}));

function rowToGallery(r: Record<string, unknown>): GalleryImage {
  return {
    id: String(r.id),
    url: String(r.url),
    alt: String(r.alt ?? ""),
    caption: String(r.caption ?? ""),
    rating: Number(r.rating ?? 5),
    author: String(r.author ?? ""),
    country: String(r.country ?? ""),
    date: String(r.review_date ?? ""),
    productSlugs: Array.isArray(r.product_slugs)
      ? (r.product_slugs as string[])
      : [],
  };
}

const GALLERY_COLS =
  "id,url,alt,caption,rating,author,country,review_date,product_slugs";

/**
 * Foto della galleria "Touchdown" mostrate in home. Legge da Supabase
 * ordinando per `position`; su qualsiasi problema (non configurata, errore,
 * tabella vuota) torna alle immagini di default, così la sezione resta piena.
 */
export async function listGalleryImages(): Promise<GalleryImage[]> {
  const sb = createReadClient();
  if (!sb) return FALLBACK;
  try {
    const { data, error } = await sb
      .from("gallery")
      .select(GALLERY_COLS)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK;
    return data.map(rowToGallery);
  } catch {
    return FALLBACK;
  }
}

/** Una singola testimonianza per la pagina di dettaglio. */
export async function getTestimonial(
  id: string,
): Promise<GalleryImage | null> {
  const sb = createReadClient();
  if (!sb || !id) return null;
  try {
    const { data, error } = await sb
      .from("gallery")
      .select(GALLERY_COLS)
      .eq("id", id)
      .maybeSingle();
    if (error || !data) return null;
    return rowToGallery(data);
  } catch {
    return null;
  }
}
