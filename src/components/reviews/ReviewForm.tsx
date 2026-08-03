"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { submitReview, type ReviewResult } from "@/features/reviews";
import { cn } from "@/lib/utils";

/** Modulo "Lascia una recensione" (voto a stelle + testo) per utenti loggati. */
export function ReviewForm({ productSlug }: { productSlug: string }) {
  const t = useTranslations("product.reviewForm");
  const [state, action, pending] = useActionState<ReviewResult | null, FormData>(
    submitReview,
    null,
  );
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  if (state?.ok) {
    return (
      <div className="mt-6 flex items-center gap-2 rounded-base border border-emerald-500/40 bg-surface px-4 py-3 text-sm text-emerald-700">
        <Check className="size-4" aria-hidden />
        {state.message}
      </div>
    );
  }

  return (
    <form
      action={action}
      className="mt-6 flex flex-col gap-3 rounded-base border border-border bg-surface p-5"
    >
      <h3 className="text-sm font-semibold uppercase tracking-tight">
        {t("formTitle")}
      </h3>
      <input type="hidden" name="productSlug" value={productSlug} />
      <input type="hidden" name="rating" value={rating} />

      <div>
        <Label className="mb-1 block">{t("yourRating")}</Label>
        <div className="flex gap-1" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              aria-label={`${n}/5`}
              className="p-0.5"
            >
              <Star
                className={cn(
                  "size-6 transition-colors",
                  (hover || rating) >= n
                    ? "fill-accent text-accent"
                    : "text-border",
                )}
                aria-hidden
              />
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="review-title">{t("titleLabel")}</Label>
        <Input id="review-title" name="title" maxLength={120} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="review-body">{t("textLabel")}</Label>
        <Textarea id="review-body" name="body" required rows={4} maxLength={2000} />
      </div>

      {state?.message && !state.ok && (
        <p className="text-sm text-danger">{state.message}</p>
      )}

      <Button type="submit" loading={pending} disabled={rating < 1} className="w-fit">
        {t("submit")}
      </Button>
    </form>
  );
}
