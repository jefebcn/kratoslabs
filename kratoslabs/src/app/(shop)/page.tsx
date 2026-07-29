import { getFeaturedProducts } from "@/lib/mock-data";
import { formatPrice, formatPricePerActiveGram } from "@/lib/utils";
import { SITE } from "@/lib/constants";

/**
 * Pagina di verifica del build. Serve a provare che token, tipi, utils e dati
 * mock funzionino insieme. Viene sostituita dalla home vera al task 6.
 */
export default function HomePage() {
  const products = getFeaturedProducts();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">
        Fondazione attiva
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        {SITE.name}
      </h1>
      <p className="mt-2 max-w-prose text-muted">{SITE.tagline}</p>

      <ul className="mt-12 divide-y divide-border border-y border-border">
        {products.map((product) => {
          const perGram = formatPricePerActiveGram(
            product.priceCents,
            product.specs.activePerServingG,
            product.specs.servingsPerContainer,
          );

          return (
            <li
              key={product.id}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{product.title}</p>
                <p className="truncate text-sm text-muted">
                  {product.shortDescription}
                </p>
              </div>
              <div className="text-right">
                <p className="num font-medium text-accent">
                  {formatPrice(product.priceCents)}
                </p>
                {perGram && <p className="num text-sm text-muted">{perGram}</p>}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
