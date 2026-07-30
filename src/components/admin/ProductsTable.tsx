import Image from "next/image";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { deleteProduct } from "@/features/admin";
import type { Product } from "@/types";

function categoryName(slug: string) {
  return CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
}

export function ProductsTable({ products }: { products: Product[] }) {
  return (
    <div className="overflow-x-auto rounded-base border border-border">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Prodotto</th>
            <th className="px-4 py-3 font-medium">Categoria</th>
            <th className="px-4 py-3 text-right font-medium">Prezzo</th>
            <th className="px-4 py-3 text-right font-medium">Stock</th>
            <th className="px-4 py-3 text-right font-medium">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr
              key={p.id}
              className="border-b border-border last:border-0 hover:bg-surface-2/50"
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative size-10 shrink-0 overflow-hidden rounded-[3px] border border-border bg-surface-2">
                    <Image
                      src={p.images[0]?.url ?? "/images/placeholder-product.svg"}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{p.title}</p>
                    <p className="text-xs text-muted">{p.brand}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-muted">
                {categoryName(p.category)}
              </td>
              <td className="num px-4 py-3 text-right">
                {formatPrice(p.priceCents)}
              </td>
              <td className="num px-4 py-3 text-right">
                {p.stock > 0 ? (
                  p.stock
                ) : (
                  <span className="text-danger">0</span>
                )}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    <Pencil className="size-3.5" aria-hidden />
                    Modifica
                  </Link>
                  <form action={deleteProduct}>
                    <input type="hidden" name="id" value={p.id} />
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1 text-muted transition-colors hover:text-danger"
                      aria-label={`Elimina ${p.title}`}
                    >
                      <Trash2 className="size-3.5" aria-hidden />
                      Elimina
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
