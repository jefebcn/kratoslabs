import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import {
  LegalScaffold,
  type LegalScaffoldLabels,
  type LegalSectionData,
} from "@/components/legal/LegalScaffold";
import type { LocaleCode } from "@/types";
import contentByLocale from "./content.json";

interface ShippingContent {
  metaTitle: string;
  metaDescription: string;
  title: string;
  updated: string;
  intro: string;
  labels: LegalScaffoldLabels;
  sections: LegalSectionData[];
}

const CONTENT = contentByLocale as Record<
  LocaleCode,
  ShippingContent | null
>;

function pick(locale: LocaleCode): ShippingContent {
  return CONTENT[locale] ?? (CONTENT.it as ShippingContent);
}

export async function generateMetadata(): Promise<Metadata> {
  const c = pick((await getLocale()) as LocaleCode);
  return { title: c.metaTitle, description: c.metaDescription };
}

export default async function ShippingAndReturnsPage() {
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
