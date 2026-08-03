import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Bitcoin, Mail, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Icon } from "@/components/ui/icon";
import { HeroCarousel, type HeroSlide } from "@/components/home/HeroCarousel";
import { ProductTabs } from "@/components/product/ProductTabs";
import { ProductGrid } from "@/components/product/ProductGrid";
import { CommunityGallery } from "@/components/product/CommunityGallery";
import { HomeInfoCards } from "@/components/home/HomeInfoCards";
import { ReviewsSection } from "@/components/reviews/ReviewsSection";
import { listFeaturedProducts, listProducts } from "@/features/products";
import { SITE, TRUST_BADGES } from "@/lib/constants";
import { listCategories } from "@/features/categories";
import { listGalleryImages } from "@/features/gallery/queries";

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
];

export default async function HomePage() {
  const t = await getTranslations("home");
  const bestseller = await listFeaturedProducts();
  const all = await listProducts();
  const categories = await listCategories();
  const galleryItems = await listGalleryImages();
  // "Nuovi prodotti": i più recenti (già ordinati per data desc).
  const newest = all.slice(0, 10);
  // Sezioni per categoria: prime 5 di ogni categoria con prodotti.
  const categorySections = categories
    .map((c) => ({
      category: c,
      products: all.filter((p) => p.category === c.slug).slice(0, 5),
    }))
    .filter((s) => s.products.length > 0);

  return (
    <div className="flex flex-col">
      {/* Carosello promozionale */}
      <HeroCarousel slides={SLIDES} />

      {/* Prodotti subito sotto il carosello: nuovi prodotti + bestseller */}
      <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
        <Reveal>
          <ProductTabs all={newest} bestseller={bestseller} />
        </Reveal>
      </section>

      {/* Sezioni per categoria: barra rossa + prodotti + "vedi tutti" */}
      {categorySections.map(({ category, products }) => (
        <section key={category.slug} className="bg-surface">
          <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
            {/* Barra rossa larga quanto la griglia prodotti sotto. */}
            <p className="bg-accent px-4 py-3 text-center font-display text-sm font-bold uppercase tracking-[0.2em] text-white">
              {category.name}
            </p>
          </div>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
            <ProductGrid products={products} />
            <div className="mt-6 text-center">
              <Link
                href={`/products?category=${category.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-accent transition-colors hover:underline"
              >
                {t("viewAll", { category: category.name })}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      ))}

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

      {/* Info: cosa trattiamo / spedizione / pagamenti */}
      <HomeInfoCards />

      {/* Feedback verificati */}
      <ReviewsSection />

      {/* Galleria Touchdown: barra rossa + foto clienti + CTA rossa */}
      <section className="border-t border-border bg-surface">
        <div className="bg-accent">
          <p className="mx-auto max-w-7xl px-4 py-3 text-center font-display text-sm font-bold uppercase tracking-[0.2em] text-white sm:px-6">
            {t("touchdownGallery")}
          </p>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <Reveal>
            <CommunityGallery items={galleryItems} />
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
            {t("sendTouchdown")}
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
