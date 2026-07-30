import {
  Beef,
  Droplets,
  Fish,
  FlaskConical,
  Pill,
  Zap,
  type LucideIcon,
} from "lucide-react";

/**
 * Icona per ogni categoria, mappata per slug. Usata sia dalla barra categorie
 * desktop (CategoryNav) sia dal drawer mobile (MobileNav), così restano
 * coerenti. Gli slug non presenti ricadono su un'icona generica.
 */
export const CATEGORY_ICON: Record<string, LucideIcon> = {
  proteine: Beef,
  creatina: FlaskConical,
  "pre-workout": Zap,
  elettroliti: Droplets,
  "omega-3": Fish,
  vitamine: Pill,
};

/** Icona di una categoria dato lo slug (fallback: Pill). */
export function categoryIcon(slug: string): LucideIcon {
  return CATEGORY_ICON[slug] ?? Pill;
}
