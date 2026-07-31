import { createReadClient } from "@/lib/supabase/read";

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
 * ordinando per `position`. Se non configurata/vuota ritorna lista vuota (la
 * sezione si nasconde): niente immagini demo residue.
 */
export async function listGalleryImages(): Promise<GalleryImage[]> {
  const sb = createReadClient();
  if (!sb) return [];
  try {
    const { data, error } = await sb
      .from("gallery")
      .select(GALLERY_COLS)
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !data || data.length === 0) return [];
    return data.map(rowToGallery);
  } catch {
    return [];
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
