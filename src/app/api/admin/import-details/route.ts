import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyImportToken } from "@/lib/import-token";
import { createAdminClient } from "@/lib/supabase/admin";
import { matchProductSlug } from "@/lib/product-match";
import { sanitizeDetails } from "@/lib/sanitize-details";

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/**
 * Riceve la scheda descrittiva di un prodotto dal bookmarklet (browser
 * dell'admin), la abbina a un prodotto per nome, la sanifica e la salva in
 * `products.details_html`. Autenticato con token firmato.
 */
export async function POST(req: NextRequest) {
  const json = (body: object, status = 200) =>
    NextResponse.json(body, { status, headers: CORS });

  try {
    const form = await req.formData();
    if (!verifyImportToken(String(form.get("token") || ""))) {
      return json({ ok: false, error: "unauthorized" }, 401);
    }

    const name = String(form.get("name") || "").trim();
    const html = sanitizeDetails(String(form.get("html") || ""));
    if (!name || html.length < 20) {
      return json({ ok: false, error: "bad_request" }, 400);
    }

    const admin = createAdminClient();
    if (!admin) return json({ ok: false, error: "no_admin" }, 500);

    const { data } = await admin.from("products").select("slug,title");
    const products = (data ?? []).map((r) => ({
      slug: String(r.slug),
      title: String(r.title),
    }));
    const slug = matchProductSlug(name, products);
    if (!slug) return json({ ok: false, error: "no_match", name });

    const { error } = await admin
      .from("products")
      .update({ details_html: html, updated_at: new Date().toISOString() })
      .eq("slug", slug);
    if (error) return json({ ok: false, error: error.message });

    revalidatePath("/", "layout");
    return json({ ok: true, slug });
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : "error" });
  }
}
