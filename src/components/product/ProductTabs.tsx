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

/** Sezione prodotti a tab: Novità / Bestseller (layout ispirato al competitor). */
export function ProductTabs({
  novita,
  bestseller,
}: {
  novita: Product[];
  bestseller: Product[];
}) {
  return (
    <Tabs defaultValue="novita">
      <TabsList className="grid w-full grid-cols-2 gap-2 border-0">
        <TabsTrigger value="novita" className={triggerClass}>
          Novità
        </TabsTrigger>
        <TabsTrigger value="bestseller" className={triggerClass}>
          Bestseller
        </TabsTrigger>
      </TabsList>
      <TabsContent value="novita">
        <ProductGrid products={novita} />
      </TabsContent>
      <TabsContent value="bestseller">
        <ProductGrid products={bestseller} />
      </TabsContent>
    </Tabs>
  );
}
