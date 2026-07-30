import Link from "next/link";
import { Bitcoin, Mail, Send } from "lucide-react";
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
import { HERO, SITE, TRUST_BADGES } from "@/lib/constants";
import { listCategories } from "@/features/categories";

const SLIDES: HeroSlide[] = [
  {
    eyebrow: "Community",
    title: "Unisciti alla community Telegram",
    subtitle: "",
    cta: { label: "Unisciti", href: SITE.telegramUrl },
    banner: "/images/banner-telegram.png",
  },
  {
    eyebrow: "Community",
    title: "La tua recensione conta",
    subtitle: "",
    cta: { label: "Scrivi una recensione", href: "/recensioni" },
    banner: "/images/banner-recensioni.png",
  },
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
    eyebrow: "Quality control",
    title: "Ogni lotto, analizzato",
    subtitle:
      "Un laboratorio indipendente verifica contenuto e contaminanti. Referto pubblico con il numero di lotto verificabile.",
    cta: { label: "Come testiamo", href: "/analisi" },
    icon: "FlaskConical",
  },
];

export default async function HomePage() {
  const bestseller = await listFeaturedProducts();
  const all = await listProducts();
  const categories = await listCategories();

  return (
    <div className="flex flex-col">
      {/* We accept: banda subito sotto l'header, sopra il carosello */}
      <PaymentsBand />

      {/* Carosello promozionale */}
      <HeroCarousel slides={SLIDES} />

      {/* Prodotti subito sotto il carosello: tutti i prodotti + bestseller */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
        <Reveal>
          <ProductTabs all={all} bestseller={bestseller} />
        </Reveal>
      </section>

      {/* Trust badges: perché sceglierci */}
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

      {/* Categorie */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
          <SectionHeading eyebrow="Categorie" title="Scegli per obiettivo" />
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((c) => (
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

      {/* Galleria Touchdown: barra rossa + foto clienti + CTA rossa */}
      <section className="border-t border-border bg-surface">
        <div className="bg-accent">
          <p className="mx-auto max-w-7xl px-4 py-3 text-center font-display text-sm font-bold uppercase tracking-[0.2em] text-white sm:px-6">
            Galleria Touchdown
          </p>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Reveal>
            <CommunityGallery />
          </Reveal>
        </div>
        <Link
          href={SITE.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-accent transition-colors hover:bg-accent/90"
        >
          <span className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-3.5 text-center font-display text-sm font-bold uppercase tracking-[0.15em] text-white sm:px-6">
            <Mail className="size-4" aria-hidden />
            Invia il tuo touchdown qui
          </span>
        </Link>
      </section>

      {/* Community / Telegram: CTA secondaria, verso il fondo */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6">
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
                <a
                  href={SITE.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Send className="size-4" aria-hidden />
                  Vai al canale Telegram
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
