import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { PriceBlock } from "@/components/product/PriceBlock";
import { StockBadge } from "@/components/product/StockBadge";
import { AddToCartButton } from "@/components/product/AddToCartButton";
import { QuickCheckoutButton } from "@/components/cart/QuickCheckoutButton";
import type { Product } from "@/types";

export function ProductCard({ product }: { product: Product }) {
  const href = `/products/${product.slug}`;
  const cover = product.images[0];

  return (
    <Card className="group flex flex-col overflow-hidden transition-colors duration-150 ease-out-expo hover:border-accent/50">
      <Link
        href={href}
        className="relative block aspect-square overflow-hidden bg-surface-2"
      >
        <Image
          src={cover?.url ?? "/images/placeholder-product.svg"}
          alt={cover?.alt ?? product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-200 ease-out-expo group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3">
          <StockBadge stock={product.stock} />
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wide text-muted">
            {product.brand}
          </p>
          <h3 className="font-display mt-1 font-semibold uppercase leading-tight tracking-tight">
            <Link href={href} className="hover:text-accent">
              {product.title}
            </Link>
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted">
            {product.shortDescription}
          </p>
        </div>

        <PriceBlock product={product} size="md" className="mt-auto" />

        <div className="flex items-center gap-2">
          <AddToCartButton product={product} className="flex-1" />
          <QuickCheckoutButton product={product} iconOnly />
        </div>
      </div>
    </Card>
  );
}
