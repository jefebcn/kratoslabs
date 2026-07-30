import Link from "next/link";
import {
  BookOpen,
  Home,
  LayoutGrid,
  ScrollText,
  Star,
  type LucideIcon,
} from "lucide-react";
import type { Category } from "@/types";
import { categoryIcon } from "@/lib/category-icons";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

/** Barra categorie desktop (nascosta su mobile: lì c'è il drawer). */
export function CategoryNav({ categories }: { categories: Category[] }) {
  const items: NavItem[] = [
    { href: "/", label: "Home", icon: Home },
    ...categories.map((c) => ({
      href: `/products?category=${c.slug}`,
      label: c.name,
      icon: categoryIcon(c.slug),
    })),
    { href: "/products", label: "Tutti i prodotti", icon: LayoutGrid },
    { href: "/guide", label: "Guide", icon: BookOpen },
    { href: "/analisi", label: "Analisi", icon: ScrollText },
    { href: "/recensioni", label: "Recensioni", icon: Star },
  ];

  return (
    <nav
      className="hidden border-b border-[#23262c] bg-[#15181d] lg:block"
      aria-label="Categorie"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="font-display inline-flex items-center gap-1.5 whitespace-nowrap px-3 py-2.5 text-[13px] font-medium uppercase tracking-wide text-white/80 transition-colors hover:text-accent"
            >
              <Icon className="size-4" aria-hidden />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
