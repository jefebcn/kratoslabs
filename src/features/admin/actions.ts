"use server";

import { revalidatePath } from "next/cache";
import { productFormSchema } from "./schema";
import { createAdminClient } from "@/lib/supabase/admin";
import { DEUS_CATEGORIES, DEUS_PRODUCTS } from "@/lib/deus-catalog";

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
  const rows = DEUS_PRODUCTS.map((p) => ({
    slug: p.slug,
    brand: "Deus Medical",
    title: p.title,
    short_description: p.shortDescription,
    description: p.description,
    category: p.category,
    price_cents: p.priceCents,
    cost_cents: p.costCents,
    specs: p.specs,
    stock: p.stock,
    active: p.active,
    updated_at: new Date().toISOString(),
  }));
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
