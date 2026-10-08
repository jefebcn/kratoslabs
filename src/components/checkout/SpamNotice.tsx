"use client";

import { useTranslations } from "next-intl";
import { MailWarning } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Avviso dopo l'ordine: l'email di pre-conferma può finire in Spam o
 * Promozioni. Chiede di spostarla in arrivo e salvare il mittente, così anche
 * conferma e tracking arrivano nella posta principale.
 */
export function SpamNotice({ className }: { className?: string }) {
  const t = useTranslations("checkout");
  return (
    <div
      role="note"
      className={cn(
        "flex items-start gap-2.5 rounded-base border border-accent/40 bg-accent-soft/40 p-3 text-left text-sm",
        className,
      )}
    >
      <MailWarning className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden />
      <div>
        <p className="font-semibold">{t("spamTitle")}</p>
        <p className="mt-0.5 text-muted">{t("spamBody")}</p>
      </div>
    </div>
  );
}
