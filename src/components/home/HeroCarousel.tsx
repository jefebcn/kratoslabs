"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  FlaskConical,
  Star,
  type LucideIcon,
} from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Le icone si passano per nome (stringa): un componente non è serializzabile
// da Server a Client Component.
const ICONS: Record<string, LucideIcon> = { Star, FlaskConical };

// Altezza FISSA e uguale per ogni slide: niente salti di layout quando ruota.
const SLIDE_H = "h-[230px] sm:h-[330px] lg:h-[440px]";

export interface HeroSlide {
  eyebrow: string;
  title: string;
  subtitle: string;
  cta: { label: string; href: string };
  image?: string;
  icon?: string;
  /** Immagine a tutta larghezza: sostituisce il layout testo+box. */
  banner?: string;
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const n = slides.length;
  const go = useCallback((i: number) => setIndex(((i % n) + n) % n), [n]);

  useEffect(() => {
    if (reduce || n <= 1) return;
    const t = setInterval(() => setIndex((p) => (p + 1) % n), 6000);
    return () => clearInterval(t);
  }, [reduce, n]);

  return (
    <section
      className="relative border-b border-border bg-surface"
      aria-roledescription="carousel"
      aria-label="Promozioni in evidenza"
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out-expo"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {slides.map((s, i) => {
            const Icon = s.icon ? ICONS[s.icon] : undefined;
            const external = /^https?:\/\//.test(s.cta.href);

            return (
              <div
                key={s.title}
                className={cn("relative w-full shrink-0", SLIDE_H)}
                aria-hidden={i !== index}
              >
                {s.banner ? (
                  <Link
                    href={s.cta.href}
                    aria-label={s.title}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="relative block size-full overflow-hidden bg-surface-2"
                  >
                    {/* Sfondo sfocato che riempie la cornice: niente barre vuote. */}
                    <Image
                      src={s.banner}
                      alt=""
                      fill
                      sizes="100vw"
                      aria-hidden
                      className="scale-110 object-cover opacity-70 blur-2xl"
                      priority={i === 0}
                    />
                    {/* Immagine INTERA, mai tagliata. */}
                    <Image
                      src={s.banner}
                      alt={s.title}
                      fill
                      sizes="100vw"
                      className="object-contain"
                      priority={i === 0}
                    />
                  </Link>
                ) : (
                  <div className="mx-auto flex h-full max-w-7xl items-center gap-8 px-4 sm:px-6 lg:grid lg:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent sm:text-xs">
                        {s.eyebrow}
                      </p>
                      <h2 className="font-display mt-2 text-balance text-2xl font-bold uppercase leading-[1.05] sm:mt-3 sm:text-4xl lg:text-5xl">
                        {s.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 max-w-xl text-pretty text-sm text-muted sm:mt-4 sm:text-base lg:line-clamp-3">
                        {s.subtitle}
                      </p>
                      <div className="mt-4 sm:mt-6">
                        <Button asChild size="lg">
                          <Link href={s.cta.href}>
                            {s.cta.label}
                            <ChevronRight className="size-4" aria-hidden />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    <div className="relative hidden aspect-[4/3] h-full max-h-[340px] items-center justify-center overflow-hidden rounded-base border border-border bg-white lg:flex">
                      {s.image ? (
                        <Image
                          src={s.image}
                          alt=""
                          fill
                          sizes="45vw"
                          className="object-contain p-6"
                          priority={i === 0}
                        />
                      ) : (
                        Icon && (
                          <div className="grid size-full place-items-center bg-accent-soft">
                            <Icon
                              className="size-24 text-accent"
                              strokeWidth={1.2}
                              aria-hidden
                            />
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Slide precedente"
            className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-border bg-bg/85 p-2 text-text transition-colors hover:text-accent sm:block"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Slide successiva"
            className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full border border-border bg-bg/85 p-2 text-text transition-colors hover:text-accent sm:block"
          >
            <ChevronRight className="size-5" aria-hidden />
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.title}
                type="button"
                onClick={() => go(i)}
                aria-label={`Vai alla slide ${i + 1}`}
                aria-current={i === index}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-6 bg-accent" : "w-2 bg-border hover:bg-muted",
                )}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
