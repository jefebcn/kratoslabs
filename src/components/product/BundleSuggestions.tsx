"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Check, Plus, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Money } from "@/components/ui/money";
import { useCart } from "@/features/cart";
import type { Product } from "@/types";

const PLACEHOLDER = "/images/placeholder-product.svg";

function BundleItem({ product, thisOne }: { product: Product; thisOne?: boolean }) {
  const t = useTranslations("product");
  const cover = product.images[0];
  return (
    <div className="flex w-28 shrink-0 flex-col gap-1.5 text-center sm:w-32">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden rounded-base border border-border bg-surface-2"
      >
        <Image
          src={cover?.url ?? PLACEHOLDER}
          alt={cover?.alt ?? product.title}
          fill
          sizes="128px"
          className="object-cover"
        />
      </Link>
      <p className="line-clamp-2 text-xs font-medium leading-tight">
        {product.title}
      </p>
      <p className="num text-xs text-muted">
        {thisOne && (
          <span className="mr-1 text-[10px] uppercase tracking-wide text-accent">
            {t("bundle.thisItem")}
          </span>
        )}
        <Money cents={product.priceCents} />
      </p>
    </div>
  );
}

/**
 * Pacchetto consigliato "spesso acquistati insieme": il prodotto corrente più
 * alcuni complementari, con aggiunta al carrello in un colpo solo.
 */
export function BundleSuggestions({
  anchor,
  items,
}: {
  anchor: Product;
  items: Product[];
}) {
  const t = useTranslations("product");
  const add = useCart((s) => s.add);
  const [added, setAdded] = useState(false);

  if (items.length === 0) return null;

  const all = [anchor, ...items];
  const totalCents = all.reduce((sum, p) => sum + p.priceCents, 0);

  function addBundle() {
    for (const p of all) add(p, 1);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1400);
  }

  return (
    <section className="mt-14">
      <h2 className="text-lg font-semibold uppercase tracking-tight">
        {t("bundle.title")}
      </h2>
      <p className="mt-1 max-w-prose text-sm text-muted">
        {t("bundle.subtitle")}
      </p>

      <div className="mt-6 rounded-base border border-border bg-surface p-4 sm:p-6">
        <div className="flex flex-wrap items-start gap-x-1 gap-y-4 sm:gap-x-2">
          {all.map((p, i) => (
            <div key={p.id} className="flex items-center gap-1 sm:gap-2">
              {i > 0 && (
                <Plus
                  className="size-4 shrink-0 text-muted"
                  aria-hidden
                />
              )}
              <BundleItem product={p} thisOne={i === 0} />
            </div>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <p className="text-sm">
            {t("bundle.total")}{" "}
            <Money
              cents={totalCents}
              className="text-base font-semibold text-accent"
            />
          </p>
          <Button type="button" onClick={addBundle} className="gap-2">
            {added ? (
              <>
                <Check className="size-4" aria-hidden />
                {t("added")}
              </>
            ) : (
              <>
                <ShoppingBag className="size-4" aria-hidden />
                {t("bundle.addAll")}
              </>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
