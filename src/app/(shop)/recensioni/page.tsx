import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
import { ReviewCard } from "@/components/reviews/ReviewCard";
import { RatingOverview } from "@/components/reviews/RatingOverview";
import { listReviews, ratingSummary } from "@/features/reviews";

export const metadata: Metadata = {
  title: "Recensioni",
  description: "Recensioni verificate dei clienti KratosLabs.",
};

export default function ReviewsPage() {
  const reviews = listReviews();
  const summary = ratingSummary(reviews);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow="Recensioni"
        title="La parola ai clienti"
        description="Valutazioni raccolte dopo l'acquisto, tutte da ordini verificati sul sito."
      />

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
    </div>
  );
}
