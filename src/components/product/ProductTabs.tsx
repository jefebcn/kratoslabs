"use client";

import { useTranslations } from "next-intl";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ProductGrid } from "@/components/product/ProductGrid";
import type { Product } from "@/types";

const triggerClass =
  "flex-1 justify-center rounded-base border-b-0 bg-surface-2 py-3 text-sm font-semibold uppercase tracking-wide text-muted transition-colors data-[state=active]:bg-accent data-[state=active]:text-white";

/** Sezione prodotti a tab: Tutti i prodotti / Bestseller (stile competitor). */
export function ProductTabs({
  all,
  bestseller,
}: {
  all: Product[];
  bestseller: Product[];
}) {
  const t = useTranslations("home");
  // I bestseller vengono per primi e sono la scheda aperta di default: per chi
  // arriva da fuori e non conosce il catalogo, "i più venduti" orienta più di
  // "i più recenti". Se non ci sono bestseller (flag `featured` non impostato)
  // si ricade sui nuovi prodotti, per non aprire su una griglia vuota.
  const hasBestseller = bestseller.length > 0;
  return (
    <Tabs defaultValue={hasBestseller ? "bestseller" : "all"}>
      <TabsList className="grid w-full grid-cols-2 gap-2 border-0">
        <TabsTrigger value="bestseller" className={triggerClass}>
          {t("bestsellers")}
        </TabsTrigger>
        <TabsTrigger value="all" className={triggerClass}>
          {t("newProducts")}
        </TabsTrigger>
      </TabsList>
      <TabsContent value="bestseller">
        <ProductGrid products={bestseller} />
      </TabsContent>
      <TabsContent value="all">
        <ProductGrid products={all} />
      </TabsContent>
    </Tabs>
  );
}
