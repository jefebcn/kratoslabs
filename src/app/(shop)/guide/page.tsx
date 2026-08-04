import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import { SectionHeading } from "@/components/ui/section-heading";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { LocaleCode } from "@/types";
import contentByLocale from "./content.json";

interface GuideCard {
  tag: string;
  title: string;
  excerpt: string;
}

interface GuideContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  guides: GuideCard[];
}

const CONTENT = contentByLocale as Record<LocaleCode, GuideContent | null>;

function pick(locale: LocaleCode): GuideContent {
  return CONTENT[locale] ?? (CONTENT.it as GuideContent);
}

export async function generateMetadata(): Promise<Metadata> {
  const c = pick((await getLocale()) as LocaleCode);
  return { title: c.metaTitle, description: c.metaDescription };
}

export default async function GuidePage() {
  const locale = (await getLocale()) as LocaleCode;
  const c = pick(locale);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
      />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {c.guides.map((g) => (
          <Link key={g.title} href="/guide" className="block">
            <Card className="h-full transition-colors hover:border-accent/50">
              <CardHeader>
                <p className="text-xs font-medium uppercase tracking-wide text-accent">
                  {g.tag}
                </p>
                <CardTitle className="mt-1">{g.title}</CardTitle>
                <CardDescription>{g.excerpt}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
