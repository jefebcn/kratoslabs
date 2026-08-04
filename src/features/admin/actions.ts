"use server";

import { revalidatePath } from "next/cache";
import { productFormSchema } from "./schema";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEUS_CATEGORIES, DEUS_PRODUCTS } from "@/lib/deus-catalog";
import { enrichDeus } from "@/lib/deus-descriptions";
import { faqsForProduct, faqsI18nForProduct } from "@/lib/deus-faqs";
import { resolveDeusImageUrl, downloadImage } from "@/lib/deus-images";

export interface ActionResult {
  ok: boolean;
  message: string;
  errors?: Record<string, string[] | undefined>;
}

const NO_ADMIN =
  "Persistenza non attiva: aggiungi SUPABASE_SERVICE_ROLE_KEY nelle Environment Variables di Vercel e ridistribuisci.";

/** Invalida la cache di tutto il sito, così le modifiche compaiono subito. */
function refreshSite() {
  revalidatePath("/", "layout");
}

/** Crea/aggiorna un prodotto su Supabase (upsert per slug). */
export async function saveProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = productFormSchema.safeParse({
    ...Object.fromEntries(formData),
    featured: formData.get("featured") === "on",
  });

  if (!parsed.success) {
    return {
      ok: false,
      message: "Alcuni campi non sono validi.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const admin = createAdminClient();
  if (!admin) return { ok: false, message: NO_ADMIN };

  const d = parsed.data;
  try {
    // Preserva immagini e referto esistenti quando si modifica un prodotto.
    const { data: existing } = await admin
      .from("products")
      .select("images, lab_report")
      .eq("slug", d.slug)
      .maybeSingle();

    // Carica le immagini nuove su Storage e appendile a quelle esistenti.
    let images: { url: string; alt: string }[] = Array.isArray(existing?.images)
      ? (existing.images as { url: string; alt: string }[])
      : [];
    const files = formData
      .getAll("imageFiles")
      .filter((f): f is File => f instanceof File && f.size > 0);
    for (const file of files) {
      const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const path = `${d.slug}/${Date.now()}-${Math.round(
        Math.random() * 1e6,
      )}-${safe}`;
      const { error: upErr } = await admin.storage
        .from("product-images")
        .upload(path, file, {
          contentType: file.type || "image/jpeg",
          upsert: false,
        });
      if (!upErr) {
        const { data: pub } = admin.storage
          .from("product-images")
          .getPublicUrl(path);
        images = [...images, { url: pub.publicUrl, alt: d.title }];
      }
    }

    const row = {
      slug: d.slug,
      brand: d.brand,
      title: d.title,
      short_description: d.shortDescription,
      description: d.description,
      category: d.category,
      price_cents: d.priceCents,
      compare_at_price_cents: d.compareAtPriceCents ?? null,
      cost_cents: d.costCents ?? 0,
      stock: d.stock,
      featured: Boolean(d.featured),
      specs: {
        netWeightG: d.netWeightG ?? 0,
        servingSizeG: d.servingSizeG ?? 0,
        servingsPerContainer: d.servingsPerContainer ?? 0,
        activePerServingG: d.activePerServingG ?? 0,
        activeName: d.activeName ?? "",
      },
      images,
      lab_report: existing?.lab_report ?? null,
      active: true,
      updated_at: new Date().toISOString(),
    };

    const { error } = await admin
      .from("products")
      .upsert(row, { onConflict: "slug" });
    if (error) return { ok: false, message: `Errore DB: ${error.message}` };

    refreshSite();
    return { ok: true, message: `Prodotto "${d.title}" salvato.` };
  } catch {
    return { ok: false, message: "Errore imprevisto nel salvataggio." };
  }
}

/** Elimina un prodotto (form action con id nascosto). */
export async function deleteProduct(formData: FormData): Promise<void> {
  const id = String(formData.get("id") || "");
  const admin = createAdminClient();
  if (!admin || !id) return;
  await admin.from("products").delete().eq("id", id);
  refreshSite();
}

export interface ImageImportResult {
  ok: boolean;
  slug: string;
  message: string;
  imageUrl?: string;
}

/** Scarica i byte immagine, li carica su Storage e li imposta sul prodotto. */
async function storeImage(
  slug: string,
  url: string,
): Promise<ImageImportResult> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, slug, message: NO_ADMIN };
  try {
    const img = await downloadImage(url);
    const path = `${slug}/deus-${Date.now()}.${img.ext}`;
    const { error: upErr } = await admin.storage
      .from("product-images")
      .upload(path, new Blob([img.bytes], { type: img.contentType }), {
        contentType: img.contentType,
        upsert: true,
      });
    if (upErr) return { ok: false, slug, message: `Upload: ${upErr.message}` };

    const { data: pub } = admin.storage
      .from("product-images")
      .getPublicUrl(path);

    const { data: prod } = await admin
      .from("products")
      .select("title")
      .eq("slug", slug)
      .maybeSingle();
    const alt = (prod?.title as string) || slug;

    const { error: updErr } = await admin
      .from("products")
      .update({
        images: [{ url: pub.publicUrl, alt }],
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug);
    if (updErr) return { ok: false, slug, message: `DB: ${updErr.message}` };

    refreshSite();
    return { ok: true, slug, message: "Immagine importata.", imageUrl: pub.publicUrl };
  } catch (e) {
    return {
      ok: false,
      slug,
      message: e instanceof Error ? e.message : "Errore imprevisto.",
    };
  }
}

/**
 * Importa automaticamente la foto ufficiale del prodotto da DeusMedical,
 * la salva su Supabase Storage e la imposta come immagine del prodotto.
 */
export async function importProductImage(
  slug: string,
): Promise<ImageImportResult> {
  if (!slug) return { ok: false, slug, message: "Slug mancante." };
  try {
    const url = await resolveDeusImageUrl(slug);
    if (!url) {
      return {
        ok: false,
        slug,
        message: "Immagine non trovata su DeusMedical (nome diverso o assente).",
      };
    }
    return await storeImage(slug, url);
  } catch (e) {
    return {
      ok: false,
      slug,
      message: e instanceof Error ? e.message : "Errore imprevisto.",
    };
  }
}

/** Carica un file immagine dal dispositivo e lo aggiunge al prodotto. */
export async function uploadProductImage(
  slug: string,
  formData: FormData,
): Promise<ImageImportResult> {
  if (!slug) return { ok: false, slug, message: "Slug mancante." };
  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, slug, message: "Nessun file selezionato." };
  }
  const admin = createAdminClient();
  if (!admin) return { ok: false, slug, message: NO_ADMIN };
  try {
    const type = file.type || "image/jpeg";
    const ext = type.includes("png")
      ? "png"
      : type.includes("webp")
        ? "webp"
        : "jpg";
    const path = `${slug}/upload-${Date.now()}.${ext}`;
    const { error: upErr } = await admin.storage
      .from("product-images")
      .upload(path, file, { contentType: type, upsert: true });
    if (upErr) return { ok: false, slug, message: `Upload: ${upErr.message}` };

    const { data: pub } = admin.storage
      .from("product-images")
      .getPublicUrl(path);

    const { data: prod } = await admin
      .from("products")
      .select("title, images")
      .eq("slug", slug)
      .maybeSingle();
    const alt = (prod?.title as string) || slug;
    const existing = Array.isArray(prod?.images)
      ? (prod.images as { url: string; alt: string }[])
      : [];

    const { error: updErr } = await admin
      .from("products")
      .update({
        images: [...existing, { url: pub.publicUrl, alt }],
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug);
    if (updErr) return { ok: false, slug, message: `DB: ${updErr.message}` };

    refreshSite();
    return {
      ok: true,
      slug,
      message: "Immagine caricata.",
      imageUrl: pub.publicUrl,
    };
  } catch (e) {
    return {
      ok: false,
      slug,
      message: e instanceof Error ? e.message : "Errore imprevisto.",
    };
  }
}

/** Fallback: importa l'immagine da un URL fornito manualmente. */
export async function importProductImageFromUrl(
  slug: string,
  url: string,
): Promise<ImageImportResult> {
  const clean = url.trim();
  if (!slug) return { ok: false, slug, message: "Slug mancante." };
  if (!/^https?:\/\//i.test(clean))
    return { ok: false, slug, message: "URL non valido." };
  return storeImage(slug, clean);
}

/* ------------------------------------------------------------------ *
 * Gestione immagini prodotto (elimina / riordina / sposta)           *
 * ------------------------------------------------------------------ */

export interface ImageOpResult {
  ok: boolean;
  message: string;
}

type Img = { url: string; alt: string };

/** Legge l'array immagini di un prodotto. */
async function readImages(
  admin: NonNullable<ReturnType<typeof createAdminClient>>,
  slug: string,
): Promise<Img[]> {
  const { data } = await admin
    .from("products")
    .select("images")
    .eq("slug", slug)
    .maybeSingle();
  return Array.isArray(data?.images) ? (data.images as Img[]) : [];
}

/** Salva l'array immagini di un prodotto. */
async function writeImages(
  admin: NonNullable<ReturnType<typeof createAdminClient>>,
  slug: string,
  images: Img[],
): Promise<string | null> {
  const { error } = await admin
    .from("products")
    .update({ images, updated_at: new Date().toISOString() })
    .eq("slug", slug);
  return error ? error.message : null;
}

/** Ricava il path dentro il bucket da un URL pubblico di Supabase Storage. */
function storagePath(url: string): string | null {
  const m = url.match(/\/product-images\/(.+)$/);
  return m?.[1] ? decodeURIComponent(m[1]) : null;
}

/**
 * Elimina un'immagine da un prodotto (e prova a rimuoverla dallo Storage se il
 * file non è più referenziato da nessun altro prodotto).
 */
export async function deleteProductImage(
  slug: string,
  url: string,
): Promise<ImageOpResult> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, message: NO_ADMIN };
  try {
    const images = await readImages(admin, slug);
    const next = images.filter((i) => i.url !== url);
    if (next.length === images.length)
      return { ok: false, message: "Immagine non trovata." };
    const err = await writeImages(admin, slug, next);
    if (err) return { ok: false, message: `DB: ${err}` };

    // Rimuovi dallo Storage solo se nessun altro prodotto usa lo stesso file.
    const path = storagePath(url);
    if (path) {
      const { data: others } = await admin
        .from("products")
        .select("id")
        .contains("images", [{ url }]);
      if (!others || others.length === 0) {
        await admin.storage.from("product-images").remove([path]);
      }
    }

    refreshSite();
    return { ok: true, message: "Immagine eliminata." };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Errore imprevisto.",
    };
  }
}

/**
 * Elimina in blocco più immagini (anche di prodotti diversi). Raggruppa per
 * prodotto per una sola scrittura per prodotto, poi ripulisce lo Storage dei
 * file non più referenziati.
 */
export async function deleteProductImages(
  targets: { slug: string; url: string }[],
): Promise<ImageOpResult> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, message: NO_ADMIN };
  if (!targets.length) return { ok: false, message: "Niente da eliminare." };
  try {
    const bySlug = new Map<string, Set<string>>();
    for (const t of targets) {
      if (!bySlug.has(t.slug)) bySlug.set(t.slug, new Set());
      bySlug.get(t.slug)!.add(t.url);
    }

    let removed = 0;
    for (const [slug, urls] of bySlug) {
      const images = await readImages(admin, slug);
      const next = images.filter((i) => !urls.has(i.url));
      removed += images.length - next.length;
      const err = await writeImages(admin, slug, next);
      if (err) return { ok: false, message: `DB: ${err}` };
    }

    // Storage: rimuovi i file non più referenziati da alcun prodotto.
    for (const t of targets) {
      const path = storagePath(t.url);
      if (!path) continue;
      const { data: others } = await admin
        .from("products")
        .select("id")
        .contains("images", [{ url: t.url }]);
      if (!others || others.length === 0) {
        await admin.storage.from("product-images").remove([path]);
      }
    }

    refreshSite();
    return { ok: true, message: `${removed} foto eliminate.` };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Errore imprevisto.",
    };
  }
}

/**
 * Riordina le immagini di un prodotto secondo l'ordine di `urls`. La prima
 * immagine diventa la copertina (usata nelle card e come miniatura).
 */
export async function reorderProductImages(
  slug: string,
  urls: string[],
): Promise<ImageOpResult> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, message: NO_ADMIN };
  try {
    const images = await readImages(admin, slug);
    const byUrl = new Map(images.map((i) => [i.url, i]));
    const next: Img[] = [];
    for (const u of urls) {
      const img = byUrl.get(u);
      if (img) {
        next.push(img);
        byUrl.delete(u);
      }
    }
    // Eventuali immagini non incluse restano in coda (nessuna perdita).
    for (const img of byUrl.values()) next.push(img);

    const err = await writeImages(admin, slug, next);
    if (err) return { ok: false, message: `DB: ${err}` };
    refreshSite();
    return { ok: true, message: "Ordine aggiornato." };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Errore imprevisto.",
    };
  }
}

/**
 * Sposta un'immagine da un prodotto a un altro. Il file resta su Storage (URL
 * invariato): viene solo tolto il riferimento dall'origine e aggiunto alla
 * destinazione, con `alt` aggiornato al titolo del prodotto di destinazione.
 */
export async function moveProductImage(
  fromSlug: string,
  toSlug: string,
  url: string,
): Promise<ImageOpResult> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, message: NO_ADMIN };
  if (fromSlug === toSlug)
    return { ok: false, message: "Origine e destinazione coincidono." };
  try {
    const fromImages = await readImages(admin, fromSlug);
    const moving = fromImages.find((i) => i.url === url);
    if (!moving) return { ok: false, message: "Immagine non trovata." };

    const { data: dest } = await admin
      .from("products")
      .select("title,images")
      .eq("slug", toSlug)
      .maybeSingle();
    if (!dest) return { ok: false, message: "Prodotto destinazione assente." };

    const alt = (dest.title as string) || toSlug;
    const destImages = Array.isArray(dest.images) ? (dest.images as Img[]) : [];
    if (destImages.some((i) => i.url === url))
      return { ok: false, message: "La destinazione ha già questa immagine." };

    const err1 = await writeImages(
      admin,
      fromSlug,
      fromImages.filter((i) => i.url !== url),
    );
    if (err1) return { ok: false, message: `DB origine: ${err1}` };
    const err2 = await writeImages(admin, toSlug, [
      ...destImages,
      { url, alt },
    ]);
    if (err2) return { ok: false, message: `DB destinazione: ${err2}` };

    refreshSite();
    return { ok: true, message: `Immagine spostata su "${alt}".` };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Errore imprevisto.",
    };
  }
}

/**
 * Importa il catalogo Deus Medical (categorie + prodotti) nel DB. Idempotente:
 * aggiorna nome/prezzi/costo dei prodotti già presenti senza crearne di doppi.
 * Non tocca le immagini eventualmente già caricate.
 */
export async function importCatalog(
  _prev: ActionResult | null,
  _formData: FormData,
): Promise<ActionResult> {
  const admin = createAdminClient();
  if (!admin) return { ok: false, message: NO_ADMIN };

  // 1) Categorie.
  const catRows = DEUS_CATEGORIES.map((c) => ({
    slug: c.slug,
    name: c.name,
    description: c.description,
    position: c.position,
    active: true,
  }));
  const { error: catErr } = await admin
    .from("categories")
    .upsert(catRows, { onConflict: "slug" });
  if (catErr)
    return { ok: false, message: `Errore categorie: ${catErr.message}` };

  // 2) Prodotti. Non sovrascrive le immagini esistenti.
  const rows = DEUS_PRODUCTS.map((p) => {
    const enriched = enrichDeus({
      title: p.title,
      category: p.category,
      activeName: p.specs.activeName,
      packaging: p.specs.packaging,
    });
    const faqInput = {
      title: p.title,
      category: p.category,
      activeName: p.specs.activeName,
      packaging: p.specs.packaging,
    };
    const faqs = faqsForProduct(faqInput, enriched.specs, "it");
    const faqsI18n = faqsI18nForProduct(faqInput, enriched.specs);
    return {
      slug: p.slug,
      brand: "Deus Medical",
      title: p.title,
      short_description: p.shortDescription,
      description: enriched.description,
      category: p.category,
      price_cents: p.priceCents,
      cost_cents: p.costCents,
      specs: enriched.specs,
      faqs,
      faqs_i18n: faqsI18n,
      stock: p.stock,
      active: p.active,
      updated_at: new Date().toISOString(),
    };
  });
  const { error: prodErr } = await admin
    .from("products")
    .upsert(rows, { onConflict: "slug" });
  if (prodErr)
    return { ok: false, message: `Errore prodotti: ${prodErr.message}` };

  refreshSite();
  return {
    ok: true,
    message: `Catalogo importato: ${catRows.length} categorie e ${rows.length} prodotti.`,
  };
}
