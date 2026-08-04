import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { RatingOverview } from "@/components/reviews/RatingOverview";
import { listReviews, ratingSummary } from "@/features/reviews";
import type { LocaleCode } from "@/types";
import contentByLocale from "./content.json";

interface ReviewsContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  empty: string;
}

const CONTENT = contentByLocale as Record<LocaleCode, ReviewsContent | null>;

function pick(locale: LocaleCode): ReviewsContent {
  return CONTENT[locale] ?? (CONTENT.it as ReviewsContent);
}

export async function generateMetadata(): Promise<Metadata> {
  const c = pick((await getLocale()) as LocaleCode);
  return { title: c.metaTitle, description: c.metaDescription };
}

export default async function ReviewsPage() {
  const locale = (await getLocale()) as LocaleCode;
  const c = pick(locale);
  const reviews = await listReviews();
  const summary = ratingSummary(reviews);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
      />

      {reviews.length === 0 ? (
        <p className="mt-8 rounded-base border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-muted">
          {c.empty}
        </p>
      ) : (
        <>
          <RatingOverview
            average={summary.average}
            count={summary.count}
            className="mt-6"
          />

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
