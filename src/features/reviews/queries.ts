import { createReadClient } from "@/lib/supabase/read";
import type { Review } from "@/types";

const byDateDesc = (a: Review, b: Review) => (a.date < b.date ? 1 : -1);

function rowToReview(r: Record<string, unknown>): Review {
  return {
    id: String(r.id),
    author: String(r.author ?? ""),
    location: String(r.location ?? ""),
    rating: Number(r.rating ?? 5),
    title: String(r.title ?? ""),
    body: String(r.body ?? ""),
    productSlug: String(r.product_slug ?? ""),
    productTitle: String(r.product_title ?? ""),
    date: String(r.review_date ?? ""),
    verifiedPurchase: Boolean(r.verified_purchase ?? true),
  };
}

/**
 * Recensioni reali dal database. Se Supabase non è configurato o la tabella è
 * vuota ritorna una lista vuota: meglio nessuna recensione che recensioni finte.
 */
export async function listReviews(): Promise<Review[]> {
  const sb = createReadClient();
  if (!sb) return [];
  try {
    const { data, error } = await sb.from("reviews").select("*");
    if (error || !data) return [];
    return data.map(rowToReview).sort(byDateDesc);
  } catch {
    return [];
  }
}

export async function reviewsForProduct(slug: string): Promise<Review[]> {
  const sb = createReadClient();
  if (!sb || !slug) return [];
  try {
    const { data, error } = await sb
      .from("reviews")
      .select("*")
      .eq("product_slug", slug);
    if (error || !data) return [];
    return data.map(rowToReview).sort(byDateDesc);
  } catch {
    return [];
  }
}

export async function featuredReviews(limit = 3): Promise<Review[]> {
  const all = await listReviews();
  return all.filter((r) => r.rating >= 5).slice(0, limit);
}

export interface RatingSummary {
  average: number;
  count: number;
}

/** Media e conteggio da una lista di recensioni (funzione pura). */
export function ratingSummary(reviews: Review[]): RatingSummary {
  if (!reviews || reviews.length === 0) return { average: 0, count: 0 };
  const sum = reviews.reduce((s, r) => s + r.rating, 0);
  return { average: sum / reviews.length, count: reviews.length };
}
