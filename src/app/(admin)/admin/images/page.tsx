import type { Metadata } from "next";
import { ImageImporter } from "@/components/admin/ImageImporter";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Immagini" };

interface Row {
  slug: string;
  title: string;
  imageUrl: string | null;
}

export default async function AdminImagesPage() {
  let products: Row[] = [];
  const admin = createAdminClient();
  if (admin) {
    const { data } = await admin
      .from("products")
      .select("slug,title,images")
      .order("title");
    products = (data ?? []).map((r) => {
      const images = Array.isArray(r.images)
        ? (r.images as { url: string }[])
        : [];
      return {
        slug: r.slug as string,
        title: r.title as string,
        imageUrl: images[0]?.url ?? null,
      };
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Immagini</h1>
        <p className="text-sm text-muted">
          Scarica velocemente le foto ufficiali dei prodotti dal produttore
          DeusMedical e salvale su Supabase. Usa i nomi dei prodotti per trovarle
          in automatico; se una non viene trovata, puoi incollare un URL.
        </p>
      </div>

      {!hasServiceRole && (
        <p className="rounded-base border border-danger/40 bg-accent-soft px-4 py-3 text-sm text-danger">
          Gestione non attiva: aggiungi <code>SUPABASE_SERVICE_ROLE_KEY</code> su
          Vercel e ridistribuisci.
        </p>
      )}

      <ImageImporter products={products} />
    </div>
  );
}
