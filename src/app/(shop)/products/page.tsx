import Link from "next/link";
import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGrid } from "@/components/product/ProductGrid";
import { listProducts, searchProducts } from "@/features/products";
import { CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { CategorySlug } from "@/types";

export const metadata: Metadata = {
  title: "Catalogo",
  description: "Tutti gli integratori KratosLabs, analizzati lotto per lotto.",
};

const SLUGS = CATEGORIES.map((c) => c.slug);

function isCategory(value?: string): value is CategorySlug {
  return !!value && SLUGS.includes(value as CategorySlug);
}

function FilterPill({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-base border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-accent text-accent"
          : "border-border text-muted hover:text-text",
      )}
    >
      {children}
    </Link>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const activeCategory = isCategory(category) ? category : undefined;

  const base = q ? await searchProducts(q) : await listProducts();
  const products = activeCategory
    ? base.filter((p) => p.category === activeCategory)
    : base;

  const activeName = activeCategory
    ? CATEGORIES.find((c) => c.slug === activeCategory)?.name
    : undefined;

  const title = activeName ?? (q ? `Risultati per “${q}”` : "Tutti i prodotti");

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow="Catalogo"
        title={title}
        description={`${products.length} ${
          products.length === 1 ? "prodotto" : "prodotti"
        }`}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <FilterPill href="/products" active={!activeCategory && !q}>
          Tutti
        </FilterPill>
        {CATEGORIES.map((c) => (
          <FilterPill
            key={c.slug}
            href={`/products?category=${c.slug}`}
            active={activeCategory === c.slug}
          >
            {c.name}
          </FilterPill>
        ))}
      </div>

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
