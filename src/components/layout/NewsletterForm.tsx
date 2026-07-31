"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const t = useTranslations("newsletter");
  const [done, setDone] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Da collegare al provider email. Per ora conferma soltanto.
    setDone(true);
  }

  if (done) {
    return (
      <p className="inline-flex items-center gap-2 text-sm text-accent">
        <Check className="size-4" aria-hidden />
        {t("done")}
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
