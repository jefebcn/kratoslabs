import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyImportToken } from "@/lib/import-token";
import { createAdminClient } from "@/lib/supabase/admin";
import { matchProductSlug } from "@/lib/product-match";

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/**
 * Riceve un'immagine dal bookmarklet (browser dell'admin), la abbina a un
 * prodotto per nome e la salva su Supabase Storage. Autenticato con token
 * firmato (createImportToken) perché la richiesta arriva da un altro dominio.
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
    const file = form.get("file");
    if (!name || !(file instanceof Blob)) {
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

    const type = file.type || "image/jpeg";
    const ext = type.includes("png")
      ? "png"
      : type.includes("webp")
        ? "webp"
        : "jpg";
    const path = `${slug}/import-${Date.now()}.${ext}`;

    const { error: upErr } = await admin.storage
      .from("product-images")
      .upload(path, file, { contentType: type, upsert: true });
    if (upErr) return json({ ok: false, error: upErr.message });

    const { data: pub } = admin.storage
      .from("product-images")
      .getPublicUrl(path);

    const alt = products.find((p) => p.slug === slug)?.title ?? slug;
    await admin
      .from("products")
      .update({
        images: [{ url: pub.publicUrl, alt }],
        updated_at: new Date().toISOString(),
      })
      .eq("slug", slug);

    revalidatePath("/", "layout");
    return json({ ok: true, slug });
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : "error" });
  }
}
