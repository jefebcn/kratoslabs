import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { Send, Mail } from "lucide-react";
import { SITE } from "@/lib/constants";
import type { LocaleCode } from "@/types";
import contentByLocale from "./content.json";

interface ContactContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  telegramTitle: string;
  telegramSub: string;
  emailTitle: string;
}

const CONTENT = contentByLocale as Record<LocaleCode, ContactContent | null>;

function pick(locale: LocaleCode): ContactContent {
  return CONTENT[locale] ?? (CONTENT.it as ContactContent);
}

export async function generateMetadata(): Promise<Metadata> {
  const c = pick((await getLocale()) as LocaleCode);
  return { title: c.metaTitle, description: c.metaDescription };
}

export default async function ContattoPage() {
  const c = pick((await getLocale()) as LocaleCode);
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {c.eyebrow}
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        {c.title}
      </h1>
      <p className="mt-4 text-muted">{c.intro}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <a
          href={SITE.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-base border border-border bg-surface p-4 transition-colors hover:border-accent"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
            <Send className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold">{c.telegramTitle}</span>
            <span className="text-sm text-muted">{c.telegramSub}</span>
          </span>
        </a>

        <a
          href={`mailto:${SITE.email}`}
          className="flex items-center gap-3 rounded-base border border-border bg-surface p-4 transition-colors hover:border-accent"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
            <Mail className="size-5" aria-hidden />
          </span>
          <span className="flex flex-col">
            <span className="text-sm font-semibold">{c.emailTitle}</span>
            <span className="text-sm text-muted">{SITE.email}</span>
          </span>
        </a>
      </div>
    </div>
  );
}
