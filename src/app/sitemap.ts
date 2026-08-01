import type { MetadataRoute } from "next";
import { listProducts } from "@/features/products";
import { CATEGORIES } from "@/lib/constants";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    "",
    "/products",
    "/recensioni",
    "/testimonianze",
    "/rewards",
    "/chi-siamo",
    "/contatto",
    "/all-ingrosso",
    "/analisi",
    "/guide",
    "/legal/privacy-policy",
    "/legal/terms-of-service",
    "/legal/shipping-and-returns",
  ].map((path) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${BASE}/products?category=${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const productRoutes = (await listProducts()).map((p) => ({
    url: `${BASE}/products/${p.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
