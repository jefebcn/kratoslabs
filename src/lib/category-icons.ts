import {
  Activity,
  Flame,
  FlaskConical,
  Heart,
  Pill,
  RefreshCw,
  Star,
  Syringe,
  type LucideIcon,
} from "lucide-react";

/**
 * Icona per ogni categoria, mappata per slug. Usata sia dalla barra categorie
 * desktop (CategoryNav) sia dal drawer mobile (MobileNav), così restano
 * coerenti. Gli slug non presenti ricadono su un'icona generica.
 */
export const CATEGORY_ICON: Record<string, LucideIcon> = {
  iniettabili: Syringe,
  orali: Pill,
  "post-cycle": RefreshCw,
  "brucia-grassi": Flame,
  "sex-support": Heart,
  "hgh-peptidi": FlaskConical,
  sarms: Star,
  salute: Activity,
};

/** Icona di una categoria dato lo slug (fallback: Pill). */
export function categoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICON[slug] ?? Pill;
}
