import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { verifyImportToken } from "@/lib/import-token";
import { createAdminClient } from "@/lib/supabase/admin";

const CORS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

/**
 * Riceve le foto della galleria "Touchdown" dal bookmarklet (browser
 * dell'admin, su un altro dominio) e le salva su Supabase Storage + tabella
 * `gallery`. Autenticato con token firmato (createImportToken).
 */
export async function POST(req: NextRequest) {
  const json = (body: object, status = 200) =>
    NextResponse.json(body, { status, headers: CORS });

  try {
    const form = await req.formData();
    if (!verifyImportToken(String(form.get("token") || ""))) {
      return json({ ok: false, error: "unauthorized" }, 401);
    }

    const files = [...form.entries()]
      .filter(
        (e): e is [string, File] =>
          e[0].startsWith("file") && e[1] instanceof File,
      )
      .sort((a, b) => a[0].localeCompare(b[0], "en", { numeric: true }))
      .map((e) => e[1]);
    if (files.length === 0) return json({ ok: false, error: "bad_request" }, 400);

    const admin = createAdminClient();
    if (!admin) return json({ ok: false, error: "no_admin" }, 500);

    const { data: last } = await admin
      .from("gallery")
      .select("position")
      .order("position", { ascending: false })
      .limit(1)
      .maybeSingle();
    let pos = (last?.position as number | undefined) ?? 0;

    let added = 0;
    let i = 0;
    for (const file of files) {
      const type = file.type || "image/jpeg";
      const ext = type.includes("png")
        ? "png"
        : type.includes("webp")
          ? "webp"
          : "jpg";
      const path = `touchdown/import-${Date.now()}-${i}.${ext}`;
      i += 1;
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
        .insert({ url: pub.publicUrl, alt: "Touchdown", position: pos });
      if (!insErr) added += 1;
    }

    if (added === 0) return json({ ok: false, error: "upload_failed" });
    revalidatePath("/", "layout");
    return json({ ok: true, count: added });
  } catch (e) {
    return json({ ok: false, error: e instanceof Error ? e.message : "error" });
  }
}
