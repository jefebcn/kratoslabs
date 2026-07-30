import { createReadClient } from "@/lib/supabase/read";
import { MOCK_PRODUCTS } from "@/lib/mock-data";
import type { CategorySlug, Product, ProductSpecs } from "@/types";

const DEFAULT_SPECS: ProductSpecs = {
  netWeightG: 0,
  servingSizeG: 0,
  servingsPerContainer: 0,
  activePerServingG: 0,
  activeName: "",
};

/** Riga DB (snake_case) -> Product (camelCase). Tollerante ai campi mancanti. */
function rowToProduct(r: Record<string, unknown>): Product {
  return {
    id: String(r.id),
    slug: String(r.slug),
    brand: (r.brand as string) || "KratosLabs",
    title: (r.title as string) || "",
    shortDescription: (r.short_description as string) || "",
    description: (r.description as string) || "",
    category: (r.category as CategorySlug) ?? "proteine",
    priceCents: Number(r.price_cents ?? 0),
    compareAtPriceCents:
      r.compare_at_price_cents != null
        ? Number(r.compare_at_price_cents)
        : undefined,
    images: Array.isArray(r.images)
      ? (r.images as { url: string; alt: string }[])
      : [],
    specs: { ...DEFAULT_SPECS, ...((r.specs as object) ?? {}) },
    labReport: (r.lab_report as Product["labReport"]) ?? undefined,
    stock: Number(r.stock ?? 0),
    featured: Boolean(r.featured),
  };
}

/**
 * Sorgente unica del catalogo. Legge da Supabase; su qualsiasi problema
 * (non configurato, errore, tabella vuota) torna ai dati mock, così il sito
 * resta sempre popolato.
 */
async function fetchProducts(): Promise<Product[]> {
  const sb = createReadClient();
  if (!sb) return MOCK_PRODUCTS;
  try {
    const { data, error } = await sb
      .from("products")
      .select("*")
      .eq("active", true)
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return MOCK_PRODUCTS;
    return data.map(rowToProduct);
  } catch {
    return MOCK_PRODUCTS;
  }
}

export async function listProducts(): Promise<Product[]> {
  return fetchProducts();
}

export async function listFeaturedProducts(): Promise<Product[]> {
  return (await fetchProducts()).filter((p) => p.featured);
}

export async function findProduct(slug: string): Promise<Product | null> {
  return (await fetchProducts()).find((p) => p.slug === slug) ?? null;
}

export async function findProductById(id: string): Promise<Product | null> {
  return (await fetchProducts()).find((p) => p.id === id) ?? null;
}

export async function listByCategory(
  category: CategorySlug,
): Promise<Product[]> {
  return (await fetchProducts()).filter((p) => p.category === category);
}

/** Ricerca testuale minimale su titolo, brand e descrizione breve. */
export async function searchProducts(query: string): Promise<Product[]> {
  const q = query.trim().toLowerCase();
  const all = await fetchProducts();
  if (!q) return all;
  return all.filter((p) =>
    [p.title, p.brand, p.shortDescription, p.category]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}
