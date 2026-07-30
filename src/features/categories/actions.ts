"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";

export interface CategoryResult {
  ok: boolean;
  message: string;
}

const categorySchema = z.object({
  slug: z
    .string()
    .min(1, "Slug obbligatorio")
    .regex(/^[a-z0-9-]+$/, "Solo minuscole, numeri e trattini"),
  name: z.string().min(1, "Nome obbligatorio"),
  description: z.string().max(200).optional(),
});

const NO_ADMIN =
  "Persistenza non attiva: aggiungi SUPABASE_SERVICE_ROLE_KEY su Vercel.";

function refresh() {
  revalidatePath("/", "layout");
}

/** Crea o rinomina una categoria (upsert per slug). */
export async function saveCategory(
  _prev: CategoryResult | null,
  formData: FormData,
): Promise<CategoryResult> {
  const parsed = categorySchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message ?? "Dati non validi.",
    };
  }
  const admin = createAdminClient();
  if (!admin) return { ok: false, message: NO_ADMIN };

  const { error } = await admin.from("categories").upsert(
    {
      slug: parsed.data.slug,
      name: parsed.data.name,
      description: parsed.data.description ?? "",
    },
    { onConflict: "slug" },
  );
  if (error) return { ok: false, message: `Errore DB: ${error.message}` };
  refresh();
  return { ok: true, message: `Categoria "${parsed.data.name}" salvata.` };
}

/** Rinomina una categoria esistente (nome + descrizione). */
export async function renameCategory(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") || "");
  const name = String(formData.get("name") || "").trim();
  const description = String(formData.get("description") || "");
  const admin = createAdminClient();
  if (!admin || !slug || !name) return;
  await admin.from("categories").update({ name, description }).eq("slug", slug);
  refresh();
}

/** Attiva/disattiva una categoria (nasconde dal sito senza eliminarla). */
export async function toggleCategory(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") || "");
  const active = String(formData.get("active") || "") === "true";
  const admin = createAdminClient();
  if (!admin || !slug) return;
  await admin.from("categories").update({ active: !active }).eq("slug", slug);
  refresh();
}

/** Elimina una categoria (i prodotti collegati restano, senza categoria). */
export async function deleteCategory(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") || "");
  const admin = createAdminClient();
  if (!admin || !slug) return;
  await admin.from("categories").delete().eq("slug", slug);
  refresh();
}
