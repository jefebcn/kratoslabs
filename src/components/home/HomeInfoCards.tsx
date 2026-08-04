import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Tag, Truck, Lock, ArrowRight } from "lucide-react";

/**
 * Tre riquadri informativi in home: cosa trattiamo, spedizione, pagamenti.
 * Testi localizzati (namespace home.info); l'enfasi <b> è resa con t.rich.
 */
export async function HomeInfoCards() {
  const t = await getTranslations("home.info");
  const bold = (chunks: React.ReactNode) => (
    <span className="font-medium text-text">{chunks}</span>
  );

  const cards = [
    { key: "products", icon: Tag, href: "/products" },
    { key: "shipping", icon: Truck, href: "/legal/shipping-and-returns" },
    { key: "payments", icon: Lock, href: "/guida-pagamenti" },
  ] as const;

  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto grid max-w-7xl gap-4 px-4 py-12 sm:px-6 md:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.key}
            className="flex flex-col rounded-base border border-border bg-surface-2/40 p-6 text-center"
          >
            <span className="mx-auto grid size-11 place-items-center rounded-full bg-accent-soft text-accent">
              <c.icon className="size-5" aria-hidden />
            </span>
            <h3 className="mt-3 text-sm font-bold uppercase tracking-[0.15em] text-accent">
              {t(`${c.key}.title`)}
            </h3>
            <p className="mt-3 flex-1 text-sm text-muted">
              {t.rich(`${c.key}.body`, { b: bold })}
            </p>
            <Link
              href={c.href}
              className="mt-4 inline-flex items-center justify-center gap-1 text-sm font-semibold text-accent hover:underline"
            >
              {t(`${c.key}.cta`)}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
