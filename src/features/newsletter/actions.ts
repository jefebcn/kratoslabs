"use server";

import { getCurrentUser } from "@/lib/supabase/server";
import { grantOnceBonus } from "@/features/rewards";
import { BONUS_NEWSLETTER } from "@/lib/rewards";

export interface NewsletterResult {
  ok: boolean;
  /** Punti bonus accreditati con questa iscrizione (0 se non spettano). */
  awardedPoints?: number;
}

/**
 * Iscrizione alla newsletter. Se l'utente è loggato, accredita una sola volta
 * il bonus punti (come deuspower). L'invio all'ESP resta da collegare.
 */
export async function subscribeNewsletter(): Promise<NewsletterResult> {
  const user = await getCurrentUser();
  if (user) {
    const granted = await grantOnceBonus(
      user.id,
      "bonus_newsletter",
      BONUS_NEWSLETTER,
    );
    return { ok: true, awardedPoints: granted ? BONUS_NEWSLETTER : 0 };
  }
  return { ok: true, awardedPoints: 0 };
}
