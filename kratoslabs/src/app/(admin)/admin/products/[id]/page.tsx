import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { MOCK_PRODUCTS } from "@/lib/mock-data";

export function generateStaticParams() {
  return MOCK_PRODUCTS.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  return { title: product ? `Modifica · ${product.title}` : "Prodotto" };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = MOCK_PRODUCTS.find((p) => p.id === id);
  if (!product) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-text"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Prodotti
        </Link>
        <h1 className="mt-2 text-xl font-semibold tracking-tight">
          {product.title}
        </h1>
        <p className="num text-sm text-muted">Modifica prodotto · {product.id}</p>
      </div>
      <ProductForm product={product} />
    </div>
  );
}
