"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";

export interface GalleryOpResult {
  ok: boolean;
  message: string;
}

const NO_ADMIN =
  "Persistenza non attiva: aggiungi SUPABASE_SERVICE_ROLE_KEY nelle Environment Variables di Vercel e ridistribuisci.";

function refreshSite() {
  revalidatePath("/", "layout");
}

/** Ricava il path dentro il bucket da un URL pubblico di Supabase Storage. */
function storagePath(url: string): string | null {
  const m = url.match(/\/product-images\/(.+)$/);
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

/** Carica sullo Storage foto della galleria fornite manualmente dall'admin. */
export async function addGalleryImages(
  formData: FormData,
): Promise<GalleryOpResult> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, message: NO_ADMIN };

  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return { ok: false, message: "Nessun file." };
  const caption = String(formData.get("caption") || "").trim();

  try {
    const { data: last } = await admin
      .from("gallery")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    let pos = (last?.position as number | undefined) ?? 0;

    let added = 0;
    for (const file of files) {
      const type = file.type || "image/jpeg";
      const ext = type.includes("png")
        ? "png"
        : type.includes("webp")
          ? "webp"
          : "jpg";
      const path = `touchdown/${Date.now()}-${added}.${ext}`;
      const { error: upErr } = await admin.storage
        .from("product-images")
        .upload(path, file, { contentType: type, upsert: true });
      if (upErr) continue;
      const { data: pub } = admin.storage
        .from("product-images")
        .getPublicUrl(path);
      pos += 1;
      const { error: insErr } = await admin
        .from("gallery")
        .insert({ url: pub.publicUrl, alt: "Touchdown", caption, position: pos });
      if (!insErr) added += 1;
    }

    if (added === 0) return { ok: false, message: "Caricamento non riuscito." };
    refreshSite();
    return { ok: true, message: `${added} foto aggiunte alla galleria.` };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Errore imprevisto.",
    };
  }
}

/** Elimina una foto della galleria (record + file su Storage). */
export async function deleteGalleryImage(
  id: string,
  url: string,
): Promise<GalleryOpResult> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, message: NO_ADMIN };
  try {
    const { error } = await admin.from("gallery").delete().eq("id", id);
    if (error) return { ok: false, message: `DB: ${error.message}` };

    const path = storagePath(url);
    if (path) {
      const { data: others } = await admin
        .from("gallery")
        .select("id")
        .eq("url", url);
      if (!others || others.length === 0) {
        await admin.storage.from("product-images").remove([path]);
      }
    }
    refreshSite();
    return { ok: true, message: "Foto eliminata." };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Errore imprevisto.",
    };
  }
}

/** Aggiorna il testo recensione (caption) di una foto della galleria. */
export async function updateGalleryCaption(
  id: string,
  caption: string,
): Promise<GalleryOpResult> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, message: NO_ADMIN };
  try {
    const { error } = await admin
      .from("gallery")
      .update({ caption: caption.trim() })
      .eq("id", id);
    if (error) return { ok: false, message: `DB: ${error.message}` };
    refreshSite();
    return { ok: true, message: "Recensione salvata." };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Errore imprevisto.",
    };
  }
}

/** Riordina la galleria secondo l'ordine di `ids`. */
export async function reorderGallery(ids: string[]): Promise<GalleryOpResult> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, message: NO_ADMIN };
  try {
    for (let i = 0; i < ids.length; i++) {
      await admin
        .from("gallery")
        .update({ position: i + 1 })
        .eq("id", ids[i]);
    }
    refreshSite();
    return { ok: true, message: "Ordine aggiornato." };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Errore imprevisto.",
    };
  }
}
