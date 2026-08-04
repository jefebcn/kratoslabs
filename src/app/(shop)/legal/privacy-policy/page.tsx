import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import {
  LegalScaffold,
  type LegalScaffoldLabels,
  type LegalSectionData,
} from "@/components/legal/LegalScaffold";
import { SITE } from "@/lib/constants";
import type { LocaleCode } from "@/types";
import contentByLocale from "./content.json";

interface LegalContent {
  metaTitle: string;
  metaDescription: string;
  title: string;
  updated: string;
  intro: string;
  labels: LegalScaffoldLabels;
  sections: LegalSectionData[];
}

const CONTENT = contentByLocale as Record<LocaleCode, LegalContent | null>;

function pick(locale: LocaleCode): LegalContent {
  const c = CONTENT[locale] ?? (CONTENT.it as LegalContent);
  return {
    ...c,
    sections: c.sections.map((s) => ({
      ...s,
      body: s.body?.replaceAll("{email}", SITE.email),
    })),
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const c = pick((await getLocale()) as LocaleCode);
  return { title: c.metaTitle, description: c.metaDescription };
}

export default async function PrivacyPolicyPage() {
  const c = pick((await getLocale()) as LocaleCode);
  return (
    <LegalScaffold
      title={c.title}
      updated={c.updated}
      intro={c.intro}
      sections={c.sections}
      labels={c.labels}
    />
  );
}
