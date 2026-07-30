import Link from "next/link";
import {
  Beef,
  BookOpen,
  Droplets,
  Fish,
  FlaskConical,
  Home,
  LayoutGrid,
  Pill,
  ScrollText,
  Star,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const CAT_ICON: Record<string, LucideIcon> = {
  proteine: Beef,
  creatina: FlaskConical,
  "pre-workout": Zap,
  elettroliti: Droplets,
  "omega-3": Fish,
  vitamine: Pill,
};

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const ITEMS: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  ...CATEGORIES.map((c) => ({
    href: `/products?category=${c.slug}`,
    label: c.name,
    icon: CAT_ICON[c.slug] ?? Pill,
  })),
  { href: "/products", label: "Tutti i prodotti", icon: LayoutGrid },
  { href: "/guide", label: "Guide", icon: BookOpen },
  { href: "/analisi", label: "Analisi", icon: ScrollText },
  { href: "/recensioni", label: "Recensioni", icon: Star },
];

/** Barra categorie desktop (nascosta su mobile: lì c'è il drawer). */
export function CategoryNav() {
  return (
    <nav
      className="hidden border-b border-[#23262c] bg-[#15181d] lg:block"
      aria-label="Categorie"
    >
      <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 sm:px-6">
        {ITEMS.map((item) => {
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
