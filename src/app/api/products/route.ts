import { NextResponse } from "next/server";
import { listProducts, searchProducts } from "@/features/products";

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? undefined;
  const category = searchParams.get("category") ?? undefined;

  let products = q ? searchProducts(q) : listProducts();
  if (category) {
    products = products.filter((p) => p.category === category);
  }

  return NextResponse.json({ count: products.length, products });
}
