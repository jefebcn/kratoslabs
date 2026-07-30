import { MOCK_REVIEWS, getReviewsByProduct } from "@/lib/mock-data";
import type { Review } from "@/types";

const byDateDesc = (a: Review, b: Review) => (a.date < b.date ? 1 : -1);

export function listReviews(): Review[] {
  return [...MOCK_REVIEWS].sort(byDateDesc);
}

export function reviewsForProduct(slug: string): Review[] {
  return getReviewsByProduct(slug).sort(byDateDesc);
}

export function featuredReviews(limit = 3): Review[] {
  return listReviews()
    .filter((r) => r.rating >= 5)
    .slice(0, limit);
}

export interface RatingSummary {
  average: number;
  count: number;
}

export function ratingSummary(reviews: Review[] = MOCK_REVIEWS): RatingSummary {
  if (reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return { average: sum / reviews.length, count: reviews.length };
}
