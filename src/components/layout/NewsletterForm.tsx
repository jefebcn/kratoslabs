"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { subscribeNewsletter } from "@/features/newsletter/actions";

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [done, setDone] = useState(false);
  const [awarded, setAwarded] = useState(0);
  const [, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Da collegare all'ESP per l'email; qui accredita l'eventuale bonus punti.
    startTransition(async () => {
      const r = await subscribeNewsletter();
      setAwarded(r.awardedPoints ?? 0);
      setDone(true);
    });
  }

  if (done) {
    return (
      <p className="inline-flex items-center gap-2 text-sm text-accent">
        <Check className="size-4" aria-hidden />
        {t("done")}
        {awarded > 0 ? ` +${awarded} pt` : ""}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
      <Input
        type="email"
        required
        placeholder={t("placeholder")}
        aria-label={t("placeholder")}
        className="sm:max-w-xs"
      />
      <Button type="submit">{t("subscribe")}</Button>
    </form>
  );
}
