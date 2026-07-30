import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";
import { findProductById } from "@/features/products";
import { listCategories } from "@/features/categories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await findProductById(id);
  return { title: product ? `Modifica · ${product.title}` : "Prodotto" };
}

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await findProductById(id);
  if (!product) notFound();
  const categories = await listCategories();

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
        <p className="num text-sm text-muted">Modifica prodotto · {product.slug}</p>
      </div>
      <ProductForm product={product} categories={categories} />
    </div>
  );
}
