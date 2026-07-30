import { createReadClient } from "@/lib/supabase/read";
import { CATEGORIES } from "@/lib/constants";
import type { Category, CategorySlug } from "@/types";

/**
 * Categorie attive per lo storefront. Legge da Supabase con fallback alla
 * costante, così il sito resta sempre navigabile.
 */
export async function listCategories(): Promise<Category[]> {
  const sb = createReadClient();
  if (!sb) return CATEGORIES;
  try {
    const { data, error } = await sb
      .from("categories")
      .select("slug,name,description")
      .eq("active", true)
      .order("position");
    if (error || !data || data.length === 0) return CATEGORIES;
    return data.map((r) => ({
      slug: r.slug as CategorySlug,
      name: r.name as string,
      description: (r.description as string) ?? "",
    }));
  } catch {
    return CATEGORIES;
  }
}
