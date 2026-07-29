import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronRight } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { SpecsTable } from "@/components/product/SpecsTable";
import { LabReportCard } from "@/components/product/LabReportCard";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { findProduct, listByCategory, listProducts } from "@/features/products";
import { CATEGORIES } from "@/lib/constants";

export function generateStaticParams() {
  return listProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) return { title: "Prodotto non trovato" };
  return {
    title: product.title,
    description: product.shortDescription,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = findProduct(slug);
  if (!product) notFound();

  const category = CATEGORIES.find((c) => c.slug === product.category);
  const related = listByCategory(product.category).filter(
    (p) => p.id !== product.id,
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav
        className="flex flex-wrap items-center gap-1.5 text-xs text-muted"
        aria-label="Percorso"
      >
        <Link href="/" className="hover:text-text">
          Home
        </Link>
        <ChevronRight className="size-3" aria-hidden />
        <Link href="/products" className="hover:text-text">
          Catalogo
        </Link>
        {category && (
          <>
            <ChevronRight className="size-3" aria-hidden />
            <Link
              href={`/products?category=${category.slug}`}
              className="hover:text-text"
            >
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="size-3" aria-hidden />
        <span className="text-text">{product.title}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} />

        <div className="flex flex-col gap-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted">
              {product.brand}
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
              {product.title}
            </h1>
            <p className="mt-3 text-pretty text-muted">
              {product.shortDescription}
            </p>
          </div>

          <ProductPurchasePanel product={product} />
        </div>
      </div>

      <div className="mt-14 max-w-3xl">
        <Tabs defaultValue="descrizione">
          <TabsList>
            <TabsTrigger value="descrizione">Descrizione</TabsTrigger>
            <TabsTrigger value="specifiche">Specifiche</TabsTrigger>
            <TabsTrigger value="lab">Lab test / QC</TabsTrigger>
          </TabsList>
          <TabsContent value="descrizione">
            <p className="max-w-prose text-pretty text-muted">
              {product.description}
            </p>
          </TabsContent>
          <TabsContent value="specifiche">
            <SpecsTable specs={product.specs} />
          </TabsContent>
          <TabsContent value="lab">
            <LabReportCard report={product.labReport} />
          </TabsContent>
        </Tabs>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-lg font-semibold tracking-tight">
            Nella stessa categoria
          </h2>
          <div className="mt-6">
            <ProductGrid products={related} />
          </div>
        </section>
      )}
    </div>
  );
}
