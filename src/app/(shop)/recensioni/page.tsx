import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { RatingOverview } from "@/components/reviews/RatingOverview";
import { listReviews, ratingSummary } from "@/features/reviews";

export const metadata: Metadata = {
  title: "Recensioni",
  description: "Recensioni verificate dei clienti KratosLabs.",
};

export default async function ReviewsPage() {
  const reviews = await listReviews();
  const summary = ratingSummary(reviews);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow="Recensioni"
        title="La parola ai clienti"
        description="Valutazioni raccolte dopo l'acquisto, tutte da ordini verificati sul sito."
      />

      {reviews.length === 0 ? (
        <p className="mt-8 rounded-base border border-dashed border-border bg-surface px-6 py-10 text-center text-sm text-muted">
          Non ci sono ancora recensioni pubblicate. Le recensioni verificate dei
          clienti compariranno qui dopo i primi acquisti.
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
