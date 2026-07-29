import Link from "next/link";
import type { Metadata } from "next";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { listProducts } from "@/features/products";

export const metadata: Metadata = { title: "Prodotti" };

export default function AdminProductsPage() {
  const products = listProducts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Prodotti</h1>
          <p className="num text-sm text-muted">
            {products.length} prodotti a catalogo
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="size-4" aria-hidden />
            Nuovo prodotto
          </Link>
        </Button>
      </div>

      <ProductsTable products={products} />
    </div>
  );
}
