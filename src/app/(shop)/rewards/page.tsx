import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  Coins,
  Gift,
  Percent,
  Wallet,
  Tag,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import { BONUS_ACCOUNT, BONUS_NEWSLETTER, BONUS_FIRST_ORDER } from "@/lib/rewards";

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
    { icon: Tag, title: t("productTitle"), text: t("productText") },
  ];

  const bonuses = [
    t("bAccount", { n: BONUS_ACCOUNT }),
    t("bNewsletter", { n: BONUS_NEWSLETTER }),
    t("bFirst", { n: BONUS_FIRST_ORDER }),
  ];

  const conditions = [t("c1"), t("c2"), t("c3"), t("c4")];

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

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
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

      <div className="mt-6 rounded-base border border-accent/30 bg-accent-soft/40 p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-tight">
          <Sparkles className="size-5 text-accent" aria-hidden />
          {t("bonusTitle")}
        </h2>
        <p className="mt-1 text-sm text-muted">{t("bonusIntro")}</p>
        <ul className="mt-3 flex flex-col gap-2">
          {bonuses.map((b) => (
            <li
              key={b}
              className="flex items-center gap-2 rounded-base bg-surface px-3 py-2 text-sm font-medium"
            >
              <Gift className="size-4 text-accent" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 rounded-base border border-border bg-surface p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-tight">
          <ShieldCheck className="size-5 text-accent" aria-hidden />
          {t("condTitle")}
        </h2>
        <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm text-muted">
          {conditions.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
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
