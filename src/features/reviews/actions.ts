"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface ReviewResult {
  ok: boolean;
  message: string;
}

/**
 * Pubblica una recensione di un cliente loggato. `verified_purchase` è calcolato
 * lato server controllando se l'utente ha un ordine che contiene il prodotto.
 */
export async function submitReview(
  _prev: ReviewResult | null,
  formData: FormData,
): Promise<ReviewResult> {
  const user = await getCurrentUser();
  if (!user) {
    return { ok: false, message: "Accedi per lasciare una recensione." };
  }

  const slug = String(formData.get("productSlug") || "").trim();
  const rating = Math.min(5, Math.max(1, Math.round(Number(formData.get("rating"))) || 0));
  const title = String(formData.get("title") || "").trim().slice(0, 120);
  const body = String(formData.get("body") || "").trim().slice(0, 2000);

  if (!slug || rating < 1) {
    return { ok: false, message: "Seleziona una valutazione." };
  }
  if (body.length < 3) {
    return { ok: false, message: "Scrivi qualche parola nella recensione." };
  }

  const admin = createAdminClient();
  if (!admin) return { ok: false, message: "Servizio non disponibile." };

  try {
    const { data: prod } = await admin
      .from("products")
      .select("title")
      .eq("slug", slug)
      .maybeSingle();

    // Acquisto verificato: l'utente ha un ordine con questo prodotto.
    const { data: orders } = await admin
      .from("orders")
      .select("lines")
      .eq("user_id", user.id);
    const purchased = (orders ?? []).some(
      (o) =>
        Array.isArray(o.lines) &&
        (o.lines as { slug?: string }[]).some((l) => l?.slug === slug),
    );

    const author =
      (user.user_metadata?.full_name as string | undefined) ||
      user.email?.split("@")[0] ||
      "Cliente";

    const { error } = await admin.from("reviews").insert({
      author,
      location: "",
      rating,
      title,
      body,
      product_slug: slug,
      product_title: (prod?.title as string) || slug,
      review_date: new Date().toISOString().slice(0, 10),
      verified_purchase: purchased,
    });
    if (error) return { ok: false, message: `Errore: ${error.message}` };

    revalidatePath("/", "layout");
    return { ok: true, message: "Grazie! La tua recensione è stata pubblicata." };
  } catch (e) {
    return {
      ok: false,
      message: e instanceof Error ? e.message : "Errore imprevisto.",
    };
  }
}
