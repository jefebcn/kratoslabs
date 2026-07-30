"use server";

import { revalidatePath } from "next/cache";
import { orderStatusSchema, productFormSchema } from "./schema";
import { createAdminClient } from "@/lib/supabase/admin";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

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

    const row = {
      slug: d.slug,
      brand: d.brand,
      title: d.title,
      short_description: d.shortDescription,
      description: d.description,
      category: d.category,
      price_cents: d.priceCents,
      compare_at_price_cents: d.compareAtPriceCents ?? null,
      stock: d.stock,
      featured: Boolean(d.featured),
      specs: {
        netWeightG: d.netWeightG,
        servingSizeG: d.servingSizeG,
        servingsPerContainer: d.servingsPerContainer,
        activePerServingG: d.activePerServingG,
        activeName: d.activeName,
      },
      images: existing?.images ?? [],
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

/** Importa il catalogo iniziale (i prodotti di esempio) nel DB. Idempotente. */
export async function importCatalog(_formData: FormData): Promise<void> {
  const admin = createAdminClient();
  if (!admin) return;
  const rows = MOCK_PRODUCTS.map((p) => ({
    slug: p.slug,
    brand: p.brand,
    title: p.title,
    short_description: p.shortDescription,
    description: p.description,
    category: p.category,
    price_cents: p.priceCents,
    compare_at_price_cents: p.compareAtPriceCents ?? null,
    images: p.images,
    specs: p.specs,
    lab_report: p.labReport ?? null,
    stock: p.stock,
    featured: p.featured,
    active: true,
  }));
  await admin.from("products").upsert(rows, { onConflict: "slug" });
  refreshSite();
}

/** Aggiornamento stato ordine + tracking. Collegato nella fase ordini. */
export async function updateOrderStatus(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = orderStatusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { ok: false, message: "Dati ordine non validi." };
  }
  return {
    ok: true,
    message: `Ordine ${parsed.data.orderId} aggiornato a "${parsed.data.status}".`,
  };
}
