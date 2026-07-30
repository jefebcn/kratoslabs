import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { ProductForm } from "@/components/admin/ProductForm";

export const metadata: Metadata = { title: "Nuovo prodotto" };

export default function NewProductPage() {
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
          Nuovo prodotto
        </h1>
      </div>
      <ProductForm />
    </div>
  );
}
