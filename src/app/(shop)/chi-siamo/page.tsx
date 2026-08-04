import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { SITE } from "@/lib/constants";
import type { LocaleCode } from "@/types";
import contentByLocale from "./content.json";

interface AboutContent {
  metaTitle: string;
  metaDescription: string;
  title: string;
  paragraphs: string[];
}

const CONTENT = contentByLocale as Record<LocaleCode, AboutContent | null>;

function pick(locale: LocaleCode): AboutContent {
  return CONTENT[locale] ?? (CONTENT.it as AboutContent);
}

export async function generateMetadata(): Promise<Metadata> {
  const c = pick((await getLocale()) as LocaleCode);
  return { title: c.metaTitle, description: c.metaDescription };
}

export default async function ChiSiamoPage() {
  const c = pick((await getLocale()) as LocaleCode);
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {SITE.name}
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        {c.title}
      </h1>

      <div className="mt-6 flex flex-col gap-4 text-pretty text-muted">
        {c.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </div>
  );
}
