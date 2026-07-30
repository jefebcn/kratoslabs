import Link from "next/link";
import type { Metadata } from "next";
import { Plus, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { listProducts } from "@/features/products";
import { importCatalog } from "@/features/admin";
import { hasServiceRole } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Prodotti" };

export default async function AdminProductsPage() {
  const products = await listProducts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Prodotti</h1>
          <p className="num text-sm text-muted">
            {products.length} prodotti a catalogo
          </p>
        </div>
        <div className="flex items-center gap-2">
          <form action={importCatalog}>
            <Button type="submit" variant="outline">
              <DownloadCloud className="size-4" aria-hidden />
              Importa catalogo iniziale
            </Button>
          </form>
          <Button asChild>
            <Link href="/admin/products/new">
              <Plus className="size-4" aria-hidden />
              Nuovo prodotto
            </Link>
          </Button>
        </div>
      </div>

      {!hasServiceRole && (
        <p className="rounded-base border border-danger/40 bg-accent-soft px-4 py-3 text-sm text-danger">
          Salvataggio non attivo: aggiungi <code>SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          nelle Environment Variables di Vercel e ridistribuisci.
        </p>
      )}

      <ProductsTable products={products} />
    </div>
  );
}
