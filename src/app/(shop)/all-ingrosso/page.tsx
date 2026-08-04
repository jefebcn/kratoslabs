import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Send } from "lucide-react";
import { SITE } from "@/lib/constants";
import type { LocaleCode } from "@/types";
import contentByLocale from "./content.json";

interface AllIngrossoContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro1Before: string;
  intro1Strong1: string;
  intro1Middle: string;
  intro1Strong2: string;
  intro1After: string;
  intro2: string;
  cta: string;
  placeholder: string;
}

const CONTENT = contentByLocale as Record<LocaleCode, AllIngrossoContent | null>;

function pick(locale: LocaleCode): AllIngrossoContent {
  return CONTENT[locale] ?? (CONTENT.it as AllIngrossoContent);
}

export async function generateMetadata(): Promise<Metadata> {
  const c = pick((await getLocale()) as LocaleCode);
  return { title: c.metaTitle, description: c.metaDescription };
}

export default async function AllIngrossoPage() {
  const locale = (await getLocale()) as LocaleCode;
  const c = pick(locale);
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {c.eyebrow}
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        {c.title}
      </h1>

      <div className="mt-6 flex flex-col gap-4 text-pretty text-muted">
        <p>
          {c.intro1Before}
          <strong className="text-text">{c.intro1Strong1}</strong>
          {c.intro1Middle}
          <strong className="text-text">{c.intro1Strong2}</strong>
          {c.intro1After}
        </p>
        <p>{c.intro2}</p>
      </div>

      <a
        href={SITE.telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex items-center gap-2 rounded-base bg-accent px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-accent/90"
      >
        <Send className="size-4" aria-hidden />
        {c.cta}
      </a>

      <p className="mt-8 text-sm italic text-muted">{c.placeholder}</p>
    </div>
  );
}
