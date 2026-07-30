import Link from "next/link";
import { ArrowRight, Bitcoin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { HeroCarousel, type HeroSlide } from "@/components/home/HeroCarousel";
import { PaymentsBand } from "@/components/layout/PaymentsBand";
import { ProductTabs } from "@/components/product/ProductTabs";
import { CommunityGallery } from "@/components/product/CommunityGallery";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { listFeaturedProducts, listProducts } from "@/features/products";
import { CATEGORIES, HERO, SITE, TRUST_BADGES } from "@/lib/constants";

const SLIDES: HeroSlide[] = [
  {
    eyebrow: "Kratos Labs",
    title: "Kratos Athletes",
    subtitle: "",
    cta: { label: "Esplora il catalogo", href: "/products" },
    banner: "/images/carousel-hero.jpg",
  },
  {
    eyebrow: HERO.eyebrow,
    title: "Dosaggi dichiarati, verificati",
    subtitle: HERO.subtitle,
    cta: { label: "Esplora il catalogo", href: "/products" },
    image: "/images/products/tub.svg",
  },
  {
    eyebrow: "Community",
    title: "Le tue recensioni contano",
    subtitle:
      "Condividi la tua esperienza dopo l'acquisto: aiuti la community a scegliere meglio, e ricevi un vantaggio riservato.",
    cta: { label: "Scrivi una recensione", href: "/recensioni" },
    icon: "Star",
  },
  {
    eyebrow: "Quality control",
    title: "Ogni lotto, analizzato",
    subtitle:
      "Un laboratorio indipendente verifica contenuto e contaminanti. Referto pubblico con il numero di lotto verificabile.",
    cta: { label: "Come testiamo", href: "/analisi" },
    icon: "FlaskConical",
  },
];

export default function HomePage() {
  const bestseller = listFeaturedProducts();
  const novita = [...listProducts()].reverse().slice(0, 4);

  return (
    <div className="flex flex-col">
      {/* Carosello promozionale */}
      <HeroCarousel slides={SLIDES} />

      {/* We accept */}
      <PaymentsBand />

      {/* Community / Telegram */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid items-center gap-6 rounded-base border border-border bg-accent-soft p-8 md:grid-cols-2">
          <div>
            <div className="inline-flex items-center gap-2 rounded-base border border-accent/30 bg-white px-2.5 py-1 text-xs font-medium text-accent">
              <Bitcoin className="size-3.5" aria-hidden />
              Accettiamo Bitcoin e criptovalute
            </div>
            <h2 className="mt-4 text-2xl font-semibold uppercase tracking-tight">
              Unisciti al canale Kratos Labs
            </h2>
            <p className="mt-2 text-muted">
              Nuovi lotti, referti di laboratorio in anteprima e offerte
              riservate. Nessuno spam, solo aggiornamenti che contano.
            </p>
          </div>
          <div className="flex md:justify-end">
            <Button asChild size="lg">
              <a href={SITE.telegramUrl} target="_blank" rel="noopener noreferrer">
                <Send className="size-4" aria-hidden />
                Vai al canale Telegram
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust badges */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
          {TRUST_BADGES.map((b) => (
            <div key={b.title} className="flex gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-base border border-border text-accent">
                <Icon name={b.icon} className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium">{b.title}</p>
                <p className="mt-1 text-sm text-muted">{b.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prodotti: Novità / Bestseller */}
      <section className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
        <Reveal>
          <div className="flex items-end justify-between gap-4">
            <SectionHeading
              eyebrow="Catalogo"
              title="Novità e bestseller"
              description="Selezionati per rapporto qualità-dose. Prezzo per grammo di attivo su ogni card."
            />
            <Link
              href="/products"
              className="hidden shrink-0 items-center gap-1 text-sm font-medium text-accent hover:underline sm:inline-flex"
            >
              Tutto il catalogo
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
          <div className="mt-8">
            <ProductTabs novita={novita} bestseller={bestseller} />
          </div>
        </Reveal>
      </section>

      {/* Categorie */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeading eyebrow="Categorie" title="Scegli per obiettivo" />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/products?category=${c.slug}`}
                className="group rounded-base border border-border bg-bg p-4 transition-colors hover:border-accent/50"
              >
                <p className="font-display text-sm font-semibold uppercase tracking-tight transition-colors group-hover:text-accent">
                  {c.name}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-muted">
                  {c.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Feedback verificati */}
      <ReviewsSection />

      {/* Dalla community */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeading
            eyebrow="Dalla community"
            title="Ordini arrivati"
            description="Foto reali inviate dai clienti. Consegna tracciata, imballo curato."
          />
          <Reveal className="mt-8">
            <CommunityGallery />
          </Reveal>
        </div>
      </section>
    </div>
  );
}
