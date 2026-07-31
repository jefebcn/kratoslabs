import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Send } from "lucide-react";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { Icon } from "@/components/ui/icon";
import { listCategories } from "@/features/categories";
import { PAYMENT_METHODS, SITE } from "@/lib/constants";

/** Riferimenti indipendenti della community (link esterni). */
const COMMUNITY_REFS: { label: string; href: string }[] = [
  { label: "MesoRx", href: "https://thinksteroids.com" },
  { label: "Eroids", href: "https://eroids.com" },
];

function Column({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-white">
        {title}
      </h3>
      <ul className="mt-4 flex flex-col gap-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-white/70 transition-colors hover:text-accent"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const categories = await listCategories();
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const year = new Date().getFullYear();
  const handle = "@" + SITE.telegramUrl.replace(/^https?:\/\/t\.me\//, "");

  const infoLinks = [
    { href: "/rewards", label: tNav("rewards") },
    { href: "/guide", label: tNav("guide") },
    { href: "/recensioni", label: tNav("reviews") },
    { href: "/analisi", label: tNav("analysisLong") },
  ];
  const legalLinks = [
    { href: "/legal/privacy-policy", label: t("privacy") },
    { href: "/legal/terms-of-service", label: t("terms") },
    { href: "/legal/shipping-and-returns", label: t("shipping") },
  ];

  return (
    <footer className="mt-16 border-t-2 border-accent bg-[#15181d] text-white/70">
      {/* Riferimenti indipendenti della community */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 py-3 text-center text-xs sm:px-6">
          <span className="font-semibold uppercase tracking-wide text-white">
            {t("communityRefs")}
          </span>
          {COMMUNITY_REFS.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/60 transition-colors hover:text-accent"
            >
              • {r.label}
            </a>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-8 text-center sm:px-6">
          <h2 className="text-sm font-bold uppercase tracking-wide text-white">
            {t("newsletterTitle")}
          </h2>
          <p className="mt-1 text-sm text-white/70">
            {t("newsletterSubtitle", { site: SITE.name })}
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </div>

      {/* Colonne */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Contatto */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-white">
              {t("contact")}
            </h3>
            <a
              href={SITE.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-3 rounded-base border border-white/15 bg-white/5 px-3 py-2.5 transition-colors hover:border-accent"
            >
              <Send className="size-5 shrink-0 text-accent" aria-hidden />
              <span className="flex flex-col">
                <span className="text-sm font-medium text-white">
                  {t("telegramCta")}
                </span>
                <span className="text-xs text-white/60">{handle}</span>
              </span>
            </a>
            <p className="mt-4 text-xs uppercase tracking-wide text-white/50">
              {t("email")}
            </p>
            <a
              href={`mailto:${SITE.email}`}
              className="text-sm font-medium text-white transition-colors hover:text-accent"
            >
              {SITE.email}
            </a>
            <p className="mt-4 text-xs uppercase tracking-wide text-white/50">
              {t("paymentMethods")}
            </p>
            <div className="mt-2 flex items-center gap-3 text-white/80">
              {PAYMENT_METHODS.map((m) => (
                <span key={m.id} title={m.label}>
                  <Icon name={m.icon} className="size-5" />
                  <span className="sr-only">{m.label}</span>
                </span>
              ))}
            </div>
          </div>

          <Column
            title={t("catalog")}
            links={categories.map((c) => ({
              href: `/products?category=${c.slug}`,
              label: c.name,
            }))}
          />
          <Column title={t("info")} links={infoLinks} />
          <Column title={t("legal")} links={legalLinks} />
        </div>
      </div>

      {/* Copyright + disclaimer */}
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-white/50 sm:px-6">
          {t("disclaimer", { year, site: SITE.name })}
        </p>
      </div>
    </footer>
  );
}
