import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { getTestimonial } from "@/features/gallery/queries";
import { findProduct } from "@/features/products";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Stars } from "@/components/reviews/Stars";
import type { Product } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const t = await getTranslations("testimonial");
  const item = await getTestimonial(id);
  return {
    title: item?.author ? `${t("crumb")} — ${item.author}` : t("title"),
    robots: { index: false },
  };
}

export default async function TestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getTestimonial(id);
  if (!item) notFound();

  const t = await getTranslations("testimonial");
  const products = (
    await Promise.all(item.productSlugs.map((s) => findProduct(s)))
  ).filter((p): p is Product => Boolean(p));

  return (
    <div>
      {/* Intestazione */}
      <div className="border-b border-border bg-surface-2">
        <div className="mx-auto max-w-5xl px-4 py-8 text-center sm:px-6">
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight sm:text-3xl">
            {t("title")}
          </h1>
          <div className="mx-auto mt-2 h-0.5 w-10 bg-accent" />
          <nav className="mt-4 flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-text">
              {t("home")}
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <Link href="/testimonianze" className="hover:text-text">
              {t("title")}
            </Link>
            <ChevronRight className="size-3" aria-hidden />
            <span className="text-text">{t("crumb")}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Immagini */}
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-tight">
            {t("images")}
          </h2>
          <div className="mt-1 h-0.5 w-8 bg-accent" />
          <div className="mt-6 max-w-md overflow-hidden rounded-base border border-border bg-surface">
            <Image
              src={item.url}
              alt={item.alt || item.author || t("crumb")}
              width={800}
              height={600}
              sizes="(max-width: 640px) 100vw, 28rem"
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </section>

        {/* Recensione */}
        <section className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-tight">
            {t("review")}
          </h2>
          <div className="mt-1 h-0.5 w-8 bg-accent" />
          <div className="mt-6 flex flex-col gap-2">
            <Stars rating={item.rating} />
            {item.author && (
              <p className="mt-2 font-semibold">{item.author}</p>
            )}
            {item.date && <p className="text-sm text-muted">{item.date}</p>}
            {item.country && (
              <p className="text-sm font-medium text-accent">{item.country}</p>
            )}
            {item.caption && (
              <p className="mt-1 max-w-2xl text-pretty">{item.caption}</p>
            )}
          </div>
        </section>

        {/* Prodotti collegati */}
        {products.length > 0 && (
          <section className="mt-12">
            <h2 className="text-sm font-semibold uppercase tracking-tight">
              {t("products")}
            </h2>
            <div className="mt-1 h-0.5 w-8 bg-accent" />
            <div className="mt-6">
              <ProductGrid products={products} />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
