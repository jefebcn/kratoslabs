import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stars } from "@/components/reviews/Stars";
import { listGalleryImages } from "@/features/gallery/queries";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("testimonial");
  return { title: t("title"), description: t("subtitle") };
}

export default async function TestimonialsIndexPage() {
  const t = await getTranslations("testimonial");
  const items = await listGalleryImages();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow={t("crumb")}
        title={t("title")}
        description={t("subtitle")}
      />

      {items.length === 0 ? (
        <p className="mt-8 rounded-base border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-muted">
          {t("empty")}
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => (
            <Link
              key={item.id}
              href={`/testimonianze/${item.id}`}
              className="group flex flex-col overflow-hidden rounded-base border border-border bg-surface transition-colors hover:border-accent"
            >
              <div className="relative aspect-square overflow-hidden bg-surface-2">
                <Image
                  src={item.url}
                  alt={item.alt || item.author || t("crumb")}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col gap-1 p-3">
                <Stars rating={item.rating} />
                {item.author && (
                  <p className="text-sm font-semibold">{item.author}</p>
                )}
                {item.country && (
                  <p className="text-xs text-muted">{item.country}</p>
                )}
                {item.caption && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted">
                    {item.caption}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
