import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LayoutGrid } from "lucide-react";
import type { Category } from "@/types";
import { categoryIcon } from "@/lib/category-icons";
import { categoryName } from "@/lib/category-i18n";

/**
 * Striscia categorie scorrevole, solo sotto `lg`.
 *
 * Su desktop l'assortimento è sempre visibile nella `CategoryNav`; su mobile
 * era sepolto nel menu hamburger, quindi chi arrivava da un social non aveva
 * modo di capire cosa vende il sito senza aprire un menu. Qui le categorie
 * sono in chiaro e scorrono orizzontalmente, così la striscia resta su una
 * sola riga qualunque sia il numero di categorie o la lunghezza dei nomi.
 */
export async function CategoryStripMobile({
  categories,
}: {
  categories: Category[];
}) {
  const [tCat, tNav] = await Promise.all([
    getTranslations("productCategory"),
    getTranslations("nav"),
  ]);

  if (categories.length === 0) return null;

  return (
    <nav
      aria-label={tNav("allProducts")}
      className="border-b border-border bg-surface lg:hidden"
    >
      {/* `overflow-x-auto` + `snap` per uno scorrimento fluido al tocco;
          la scrollbar è nascosta via utility globale. */}
      <ul className="no-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto px-4 py-2.5">
        {categories.map((c) => {
          const Icon = categoryIcon(c.slug);
          return (
            <li key={c.slug} className="snap-start">
              <Link
                href={`/products?category=${c.slug}`}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-bg px-3 py-1.5 text-xs font-semibold text-text transition-colors hover:border-accent hover:text-accent"
              >
                <Icon className="size-3.5 shrink-0 text-accent" aria-hidden />
                {categoryName(tCat, c.slug, c.name)}
              </Link>
            </li>
          );
        })}
        {/* Ultima pillola: accesso al catalogo completo. */}
        <li className="snap-start">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-accent bg-accent px-3 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90"
          >
            <LayoutGrid className="size-3.5 shrink-0" aria-hidden />
            {tNav("allProducts")}
          </Link>
        </li>
      </ul>
    </nav>
  );
}
