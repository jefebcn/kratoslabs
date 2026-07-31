import { createReadClient } from "@/lib/supabase/read";
import { GALLERY_ITEMS } from "@/lib/constants";

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
}

/** Fallback dal codice quando la tabella è vuota o non configurata. */
const FALLBACK: GalleryImage[] = GALLERY_ITEMS.map((g) => ({
  id: g.id,
  url: g.imageUrl,
  alt: g.alt,
}));

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
      .select("id,url,alt")
      .order("position", { ascending: true })
      .order("created_at", { ascending: true });
    if (error || !data || data.length === 0) return FALLBACK;
    return data.map((r) => ({
      id: String(r.id),
      url: String(r.url),
      alt: String(r.alt ?? ""),
    }));
  } catch {
    return FALLBACK;
  }
}
