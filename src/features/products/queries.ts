import {
  MOCK_PRODUCTS,
  getFeaturedProducts,
  getProductBySlug,
  getProductsByCategory,
} from "@/lib/mock-data";
import type { CategorySlug, Product } from "@/types";

/**
 * Punto di accesso ai prodotti. Oggi legge i dati mock; domani diventa una
 * query al DB mantenendo la stessa firma, così i componenti non cambiano.
 */
export function listProducts(): Product[] {
  return MOCK_PRODUCTS;
}

export function listFeaturedProducts(): Product[] {
  return getFeaturedProducts();
}

export function findProduct(slug: string): Product | null {
  return getProductBySlug(slug);
}

export function listByCategory(category: CategorySlug): Product[] {
  return getProductsByCategory(category);
}

/** Ricerca testuale minimale su titolo, brand e descrizione breve. */
export function searchProducts(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return MOCK_PRODUCTS;
  return MOCK_PRODUCTS.filter((p) =>
    [p.title, p.brand, p.shortDescription, p.category]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}
