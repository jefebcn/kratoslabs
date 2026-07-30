import type { Metadata } from "next";
import { CategoryManager } from "@/components/admin/CategoryManager";
import {
  createAdminClient,
  hasServiceRole,
  serviceKeyWarning,
} from "@/lib/supabase/admin";
import { CATEGORIES } from "@/lib/constants";

export const metadata: Metadata = { title: "Categorie" };

interface Row {
  slug: string;
  name: string;
  description: string;
  active: boolean;
}

export default async function AdminCategoriesPage() {
  let categories: Row[];
  const admin = createAdminClient();
  if (admin) {
    const { data } = await admin
      .from("categories")
      .select("slug,name,description,active")
      .order("position");
    categories = (data ?? []).map((r) => ({
      slug: r.slug as string,
      name: r.name as string,
      description: (r.description as string) ?? "",
      active: Boolean(r.active),
    }));
  } else {
    categories = CATEGORIES.map((c) => ({
      slug: c.slug,
      name: c.name,
      description: c.description,
      active: true,
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Categorie</h1>
        <p className="text-sm text-muted">
          Le sezioni del sito. Rinomina, nascondi o elimina; i clienti vedono
          solo quelle attive.
        </p>
      </div>

      {!hasServiceRole && (
        <p className="rounded-base border border-danger/40 bg-accent-soft px-4 py-3 text-sm text-danger">
          Gestione non attiva: aggiungi <code>SUPABASE_SERVICE_ROLE_KEY</code> su
          Vercel e ridistribuisci.
        </p>
      )}

      {hasServiceRole && serviceKeyWarning && (
        <p className="rounded-base border border-danger/40 bg-accent-soft px-4 py-3 text-sm text-danger">
          {serviceKeyWarning}
        </p>
      )}

      <CategoryManager categories={categories} />
    </div>
  );
}
