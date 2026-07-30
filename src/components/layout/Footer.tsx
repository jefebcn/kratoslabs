import Link from "next/link";
import { Instagram, Send } from "lucide-react";
import { Logo } from "@/components/layout/Logo";
import { NewsletterForm } from "@/components/layout/NewsletterForm";
import { Icon } from "@/components/ui/icon";
import { listCategories } from "@/features/categories";
import {
  LEGAL_LINKS,
  NAV_LINKS,
  PAYMENT_METHODS,
  SITE,
} from "@/lib/constants";

function Column({
  title,
  links,
}: {
  title: string;
  links: readonly { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-medium uppercase tracking-wide text-muted">
        {title}
      </h3>
      <ul className="mt-3 flex flex-col gap-2">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-text transition-colors hover:text-accent"
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
  return (
    <footer className="mt-16 border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo />
            <p className="mt-3 max-w-xs text-sm text-muted">{SITE.tagline}</p>
            <div className="mt-4 flex items-center gap-2">
              <a
                href={SITE.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Canale Telegram"
                className="inline-flex size-9 items-center justify-center rounded-base border border-border text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <Send className="size-4" aria-hidden />
              </a>
              <a
                href={SITE.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Profilo Instagram"
                className="inline-flex size-9 items-center justify-center rounded-base border border-border text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <Instagram className="size-4" aria-hidden />
              </a>
            </div>
          </div>

          <Column
            title="Catalogo"
            links={categories.map((c) => ({
              href: `/products?category=${c.slug}`,
              label: c.name,
            }))}
          />
          <Column title="Risorse" links={NAV_LINKS} />
          <Column title="Legale" links={LEGAL_LINKS} />
        </div>

        <div className="mt-10 grid gap-4 border-t border-border pt-8 lg:grid-cols-2">
          <div>
            <h3 className="text-sm font-medium">Resta aggiornato</h3>
            <p className="mt-1 text-sm text-muted">
              Nuovi lotti, referti e offerte. Niente spam.
            </p>
          </div>
          <div className="lg:justify-self-end">
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} {SITE.name}. Tutti i diritti riservati.
          </p>
          <div className="flex items-center gap-3">
            {PAYMENT_METHODS.map((m) => (
              <span
                key={m.id}
                title={m.label}
                className="inline-flex items-center gap-1 text-xs text-muted"
              >
                <Icon name={m.icon} className="size-4" />
                <span className="sr-only">{m.label}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
