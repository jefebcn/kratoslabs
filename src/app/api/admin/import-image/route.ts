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
 * Riceve una o più immagini dal bookmarklet (browser dell'admin), le abbina a
 * un prodotto per nome e le salva su Supabase Storage nell'ordine ricevuto.
 * Autenticato con token firmato (createImportToken) perché la richiesta arriva
 * da un altro dominio. Il bookmarklet invia i file come file0, file1, ...
 * seguendo l'ordine della galleria sul sito sorgente.
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
    // Accetta più file (file0, file1, …) mantenendone l'ordine; retro-compatibile
    // con un singolo campo "file".
    const files = [...form.entries()]
      .filter(
        (e): e is [string, File] =>
          e[0].startsWith("file") && e[1] instanceof File,
      )
      .sort((a, b) => a[0].localeCompare(b[0], "en", { numeric: true }))
      .map((e) => e[1]);
    if (!name || files.length === 0) {
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

    const alt = products.find((p) => p.slug === slug)?.title ?? slug;
    const images: { url: string; alt: string }[] = [];

    let idx = 0;
    for (const file of files) {
      const type = file.type || "image/jpeg";
      const ext = type.includes("png")
        ? "png"
        : type.includes("webp")
          ? "webp"
          : "jpg";
      const path = `${slug}/import-${Date.now()}-${idx}.${ext}`;
      idx += 1;

      const { error: upErr } = await admin.storage
        .from("product-images")
        .upload(path, file, { contentType: type, upsert: true });
      if (upErr) continue;

      const { data: pub } = admin.storage
        .from("product-images")
        .getPublicUrl(path);
      images.push({ url: pub.publicUrl, alt });
    }

    if (images.length === 0) {
      return json({ ok: false, error: "upload_failed" });
    }

    await admin
      .from("products")
      .update({ images, updated_at: new Date().toISOString() })
      .eq("slug", slug);

    revalidatePath("/", "layout");
    return json({ ok: true, slug, count: images.length });
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : "error" });
  }
}
