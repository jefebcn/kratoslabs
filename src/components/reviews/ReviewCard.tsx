import Link from "next/link";
import { BadgeCheck } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Stars } from "@/components/reviews/Stars";
import { formatDate } from "@/lib/utils";
import type { Review } from "@/types";

export function ReviewCard({
  review,
  showProduct = true,
}: {
  review: Review;
  showProduct?: boolean;
}) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <Stars rating={review.rating} />
          {review.verifiedPurchase && (
            <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
              <BadgeCheck className="size-3.5" aria-hidden />
              Acquisto verificato
            </span>
          )}
        </div>
        <p className="font-display mt-2 text-base font-semibold uppercase tracking-tight">
          {review.title}
        </p>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        <p className="text-sm text-muted">{review.body}</p>
        <div className="mt-4 flex items-center justify-between gap-2 text-xs text-muted">
          <span>
            <span className="text-text">{review.author}</span> · {review.location}
          </span>
          <span className="num">{formatDate(review.date)}</span>
        </div>
        {showProduct && (
          <Link
            href={`/products/${review.productSlug}`}
            className="font-display mt-2 w-fit text-xs font-semibold uppercase tracking-wide text-accent hover:underline"
          >
            {review.productTitle}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
