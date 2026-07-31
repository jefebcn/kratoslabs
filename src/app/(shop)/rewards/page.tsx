import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Coins, Gift, Percent, Wallet } from "lucide-react";
import { SITE } from "@/lib/constants";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("rewards");
  return { title: t("title"), description: t("intro") };
}

export default async function RewardsPage() {
  const t = await getTranslations("rewards");

  const cards = [
    { icon: Coins, title: t("earnTitle"), text: t("earnText") },
    { icon: Percent, title: t("valueTitle"), text: t("valueText") },
    { icon: Wallet, title: t("useTitle"), text: t("useText") },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {SITE.name}
      </p>
      <h1 className="font-display mt-2 flex items-center gap-3 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        <Gift className="size-8 text-accent" aria-hidden />
        {t("title")}
      </h1>
      <p className="mt-4 text-pretty text-muted">{t("intro")}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.title}
            className="rounded-base border border-border bg-surface p-5"
          >
            <c.icon className="size-6 text-accent" aria-hidden />
            <h2 className="mt-3 text-sm font-semibold uppercase tracking-tight">
              {c.title}
            </h2>
            <p className="mt-1.5 text-sm text-muted">{c.text}</p>
          </div>
        ))}
      </div>

      <p className="mt-8 rounded-base border border-accent/30 bg-accent-soft/40 px-4 py-3 text-sm">
        {t("note")}{" "}
        <Link href="/account" className="font-semibold text-accent hover:underline">
          {t("title")}
        </Link>
        .
      </p>
    </div>
  );
}
