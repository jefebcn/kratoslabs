import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ChevronRight, Gift } from "lucide-react";
import { pointsEarnedFor, priceInPoints } from "@/lib/rewards";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductDetails } from "@/components/product/ProductDetails";
import { SpecsTable } from "@/components/product/SpecsTable";
import { LabReportCard } from "@/components/product/LabReportCard";
import { ProductPurchasePanel } from "@/components/product/ProductPurchasePanel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { RatingOverview } from "@/components/reviews/RatingOverview";
import { Stars } from "@/components/reviews/Stars";
import { findProduct, listByCategory } from "@/features/products";
import { ratingSummary, reviewsForProduct } from "@/features/reviews";
import { listCategories } from "@/features/categories";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await findProduct(slug);
  if (!product) {
    const t = await getTranslations("product");
    return { title: t("notFound") };
  }
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
  const product = await findProduct(slug);
  if (!product) notFound();

  const t = await getTranslations("product");
  const categories = await listCategories();
  const category = categories.find((c) => c.slug === product.category);
  const related = (await listByCategory(product.category)).filter(
    (p) => p.id !== product.id,
  );
  const reviews = await reviewsForProduct(slug);
  const rating = ratingSummary(reviews);

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
            <h1 className="mt-1 text-2xl font-semibold uppercase tracking-tight sm:text-3xl">
              {product.title}
            </h1>
            <p className="mt-3 text-pretty text-muted">
              {product.shortDescription}
            </p>
            {pointsEarnedFor(product.priceCents) > 0 && (
              <div className="mt-3 flex flex-col gap-1">
                <p className="inline-flex w-fit items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent">
                  <Gift className="size-3.5" aria-hidden />
                  {t("rewardPoints", {
                    points: pointsEarnedFor(product.priceCents),
                  })}
                </p>
                <p className="text-xs text-muted">
                  {t("priceInPoints", {
                    points: priceInPoints(product.priceCents),
                  })}
                </p>
              </div>
            )}
            {rating.count > 0 && (
              <a
                href="#recensioni"
                className="mt-3 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-text"
              >
                <Stars rating={Math.round(rating.average)} />
                <span className="num">
                  {rating.average.toFixed(1).replace(".", ",")} ·{" "}
                  {rating.count} recensioni
                </span>
              </a>
            )}
          </div>

          <ProductPurchasePanel product={product} />
        </div>
      </div>

      <div className="mt-14 max-w-3xl">
        <Tabs defaultValue="descrizione">
          <TabsList>
            <TabsTrigger value="descrizione">{t("tabDescription")}</TabsTrigger>
            <TabsTrigger value="specifiche">{t("tabSpecs")}</TabsTrigger>
            <TabsTrigger value="lab">{t("tabLab")}</TabsTrigger>
          </TabsList>
          <TabsContent value="descrizione">
            {product.detailsHtml ? (
              <ProductDetails html={product.detailsHtml} />
            ) : (
              <p className="max-w-prose text-pretty text-muted">
                {product.description}
              </p>
            )}
          </TabsContent>
          <TabsContent value="specifiche">
            <SpecsTable specs={product.specs} />
          </TabsContent>
          <TabsContent value="lab">
            <LabReportCard report={product.labReport} />
          </TabsContent>
        </Tabs>
      </div>

      <section id="recensioni" className="mt-16 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="text-lg font-semibold uppercase tracking-tight">
            {t("tabReviews")}
          </h2>
          {rating.count > 0 && (
            <RatingOverview average={rating.average} count={rating.count} />
          )}
        </div>
        {reviews.length > 0 ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} showProduct={false} />
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted">
            Questo prodotto non ha ancora recensioni. Sarai tra i primi a
            lasciarne una dopo l&apos;acquisto.
          </p>
        )}
      </section>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-lg font-semibold uppercase tracking-tight">
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
