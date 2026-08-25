import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Instagram, Send } from "lucide-react";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { listCategories } from "@/features/categories";
import { SITE } from "@/lib/constants";

/** Glyph TikTok (lucide non ha l'icona del brand). */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <path d="M16.5 3c.3 2.1 1.5 3.6 3.5 3.9v2.6c-1.2.1-2.4-.2-3.5-.8v5.9c0 3-2 5.4-5 5.4-2.8 0-5-2.2-5-4.9 0-2.8 2.3-4.9 5.2-4.6v2.7c-.4-.1-.8-.2-1.2-.1-1.1.1-1.9 1-1.9 2.1 0 1.2 1 2.1 2.1 2.1 1.2 0 2.1-.9 2.1-2.4V3h3.2z" />
    </svg>
  );
}

/** Link social a icona circolare (sfondo scuro del footer). */
function SocialLinks({ label }: { label: string }) {
  const items = [
    { href: SITE.instagramUrl, name: "Instagram", Icon: Instagram },
    { href: SITE.tiktokUrl, name: "TikTok", Icon: TikTokIcon },
  ];
  return (
    <>
      <p className="mt-4 text-xs uppercase tracking-wide text-white/50">
        {label}
      </p>
      <div className="mt-2 flex items-center gap-2.5">
        {items.map(({ href, name, Icon }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition-colors hover:border-accent hover:text-accent"
          >
            <Icon className="size-4" />
          </a>
        ))}
      </div>
    </>
  );
}

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
  // Da un link pubblico (t.me/nome) ricava la handle "@nome"; per un link
  // d'invito (t.me/+hash) non c'è una handle pubblica, quindi non la mostriamo.
  const tgPath = SITE.telegramUrl.replace(/^https?:\/\/t\.me\//, "");
  const handle = tgPath.startsWith("+") ? null : "@" + tgPath;

  const infoLinks = [
    { href: "/rewards", label: tNav("rewards") },
    { href: "/testimonianze", label: tNav("testimonials") },
    { href: "/guida-pagamenti", label: tNav("paymentGuide") },
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
                {handle && (
                  <span className="text-xs text-white/60">{handle}</span>
                )}
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
            <SocialLinks label={t("follow")} />
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

      {/* Metodi di pagamento + spedizione (loghi trasparenti) */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-6 sm:px-6">
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/50">
            {t("paymentMethods")}
          </span>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* eslint-disable @next/next/no-img-element */}
            <span className="flex h-8 items-center rounded-[6px] bg-white px-2.5">
              <img
                src="/images/pay/cards.png"
                alt="PayPal, Visa, Mastercard, American Express"
                className="h-4 w-auto"
              />
            </span>
            <span className="flex h-8 items-center rounded-[6px] bg-white px-2">
              <img src="/images/pay/btc.png" alt="Bitcoin" className="h-6 w-auto" />
            </span>
            <span className="flex h-8 items-center rounded-[6px] bg-white px-2">
              <img src="/images/pay/usdt.png" alt="Tether USDT" className="h-6 w-auto" />
            </span>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-white/70">
              <span className="flex h-8 items-center rounded-[6px] bg-white px-2">
                <img
                  src="/images/pay/shipping.png"
                  alt=""
                  className="h-5 w-auto"
                />
              </span>
              {t("fastShipping")}
            </span>
            {/* eslint-enable @next/next/no-img-element */}
          </div>
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
