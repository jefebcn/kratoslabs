import { getTranslations } from "next-intl/server";
import {
  Atom,
  Dna,
  Flame,
  Heart,
  HeartPulse,
  Package,
  Pill,
  Recycle,
  Syringe,
  type LucideIcon,
} from "lucide-react";

/** Icona rappresentativa per categoria (fallback: Package). */
const ICONS: Record<string, LucideIcon> = {
  iniettabili: Syringe,
  orali: Pill,
  "post-cycle": Recycle,
  "brucia-grassi": Flame,
  "sex-support": Heart,
  "hgh-peptidi": Dna,
  sarms: Atom,
  salute: HeartPulse,
};

/**
 * Banner hero della categoria, mostrato in cima alla scheda prodotto. Nome e
 * sottotitolo sono localizzati (namespace `productCategory`), con fallback ai
 * valori del catalogo. Banda scura brandizzata, coerente in tema chiaro/scuro.
 */
export async function CategoryHero({
  slug,
  fallbackName,
  fallbackTagline,
}: {
  slug: string;
  fallbackName: string;
  fallbackTagline?: string;
}) {
  const t = await getTranslations("productCategory");
  const name = t.has(`${slug}.name`) ? t(`${slug}.name`) : fallbackName;
  const tagline = t.has(`${slug}.tagline`)
    ? t(`${slug}.tagline`)
    : (fallbackTagline ?? "");
  const eyebrow = t.has("eyebrow") ? t("eyebrow") : "Categoria";
  const Icon = ICONS[slug] ?? Package;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-[#26262b] bg-[#141416] text-white">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(120%_140%_at_88%_-30%,rgba(225,29,42,0.38),transparent_60%)]"
      />
      <Icon
        aria-hidden
        className="pointer-events-none absolute -right-6 top-1/2 size-44 -translate-y-1/2 rotate-12 text-white/[0.06] sm:size-56"
        strokeWidth={1.25}
      />
      <div className="relative px-6 py-8 sm:px-10 sm:py-10">
        <p className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-[0.24em] text-accent">
          <span className="inline-block size-2 rounded-full bg-accent shadow-[0_0_0_4px_rgba(225,29,42,0.25)]" />
          KratosLabs · {eyebrow}
        </p>
        <p className="font-display mt-3 text-3xl font-extrabold uppercase leading-none tracking-tight sm:text-4xl">
          {name}
        </p>
        {tagline && (
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
            {tagline}
          </p>
        )}
      </div>
    </section>
  );
}
