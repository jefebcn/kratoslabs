"use client";

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
  return (
    <Tabs defaultValue="all">
      <TabsList className="grid w-full grid-cols-2 gap-2 border-0">
        <TabsTrigger value="all" className={triggerClass}>
          Tutti i prodotti
        </TabsTrigger>
        <TabsTrigger value="bestseller" className={triggerClass}>
          Bestseller
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <ProductGrid products={all} />
      </TabsContent>
      <TabsContent value="bestseller">
        <ProductGrid products={bestseller} />
      </TabsContent>
    </Tabs>
  );
}
