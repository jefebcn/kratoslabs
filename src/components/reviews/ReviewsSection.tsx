import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { RatingOverview } from "@/components/reviews/RatingOverview";
import { listReviews, ratingSummary } from "@/features/reviews";

/** Blocco "feedback verificati" per la homepage. Nascosto se non ci sono
 *  recensioni reali (niente contenuti finti). */
export async function ReviewsSection() {
  const all = await listReviews();
  if (all.length === 0) return null;
  const reviews = all.filter((r) => r.rating >= 5).slice(0, 3);
  const summary = ratingSummary(all);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading
          eyebrow="Feedback verificati"
          title="Chi ha comprato, cosa dice"
          description="Recensioni da ordini reali sul sito: ogni voto è di un acquisto verificato."
        />
        <RatingOverview average={summary.average} count={summary.count} />
      </div>

      <Reveal className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </Reveal>

      <div className="mt-6">
        <Link
          href="/recensioni"
          className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
        >
          Tutte le recensioni
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
