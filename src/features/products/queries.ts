import { getLocale } from "next-intl/server";
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

/** Locale corrente lato server; "it" se fuori dal contesto di richiesta. */
async function currentLocale(): Promise<string> {
  try {
    return await getLocale();
  } catch {
    return "it";
  }
}

/** Sceglie il valore per la lingua da una mappa {it,en,...}; fallback su it. */
function pickI18n<T>(
  map: unknown,
  locale: string,
  fallback: T | undefined,
): T | undefined {
  if (map && typeof map === "object") {
    const m = map as Record<string, T>;
    return m[locale] ?? m.it ?? fallback;
  }
  return fallback;
}

/** Riga DB (snake_case) -> Product (camelCase). Tollerante ai campi mancanti. */
function rowToProduct(r: Record<string, unknown>, locale = "it"): Product {
  const faqsIt = Array.isArray(r.faqs)
    ? (r.faqs as Product["faqs"])
    : undefined;
  return {
    id: String(r.id),
    slug: String(r.slug),
    brand: (r.brand as string) || "KratosLabs",
    title: (r.title as string) || "",
    shortDescription:
      pickI18n<string>(r.short_description_i18n, locale, undefined) ||
      (r.short_description as string) ||
      "",
    description:
      pickI18n<string>(r.description_i18n, locale, undefined) ||
      (r.description as string) ||
      "",
    category: (r.category as CategorySlug) ?? "",
    priceCents: Number(r.price_cents ?? 0),
    compareAtPriceCents:
      r.compare_at_price_cents != null
        ? Number(r.compare_at_price_cents)
        : undefined,
    costCents: Number(r.cost_cents ?? 0),
    images: Array.isArray(r.images)
      ? (r.images as { url: string; alt: string }[])
      : [],
    specs: { ...DEFAULT_SPECS, ...((r.specs as object) ?? {}) },
    labReport: (r.lab_report as Product["labReport"]) ?? undefined,
    detailsHtml: (r.details_html as string) || undefined,
    faqs: pickI18n<Product["faqs"]>(r.faqs_i18n, locale, faqsIt),
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
    const locale = await currentLocale();
    return data.map((r) => rowToProduct(r, locale));
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
