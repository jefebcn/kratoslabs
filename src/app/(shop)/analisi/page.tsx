import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import {
  FileCheck2,
  FlaskConical,
  PackageCheck,
  ScrollText,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { listProducts } from "@/features/products";
import { formatDate } from "@/lib/utils";
import type { LocaleCode } from "@/types";
import contentByLocale from "./content.json";

interface AnalisiContent {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  description: string;
  steps: { title: string; body: string }[];
  recentTitle: string;
  tableHeaders: {
    product: string;
    lab: string;
    batch: string;
    date: string;
    report: string;
  };
}

const CONTENT = contentByLocale as Record<LocaleCode, AnalisiContent | null>;

function pick(locale: LocaleCode): AnalisiContent {
  return CONTENT[locale] ?? (CONTENT.it as AnalisiContent);
}

const STEP_ICONS: LucideIcon[] = [PackageCheck, FlaskConical, ScrollText];

export async function generateMetadata(): Promise<Metadata> {
  const c = pick((await getLocale()) as LocaleCode);
  return { title: c.metaTitle, description: c.metaDescription };
}

export default async function AnalisiPage() {
  const locale = (await getLocale()) as LocaleCode;
  const c = pick(locale);

  const batches = (await listProducts())
    .filter((p) => p.labReport)
    .map((p) => ({ product: p.title, report: p.labReport! }));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <SectionHeading
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {c.steps.map((s, i) => {
          const Icon = STEP_ICONS[i]!;
          return (
            <div key={s.title} className="rounded-base border border-border p-5">
              <span className="grid size-10 place-items-center rounded-base border border-border text-accent">
                <Icon className="size-5" aria-hidden />
              </span>
              <p className="mt-3 text-sm font-medium">{s.title}</p>
              <p className="mt-1 text-sm text-muted">{s.body}</p>
            </div>
          );
        })}
      </div>

      <h2 className="mt-12 text-lg font-semibold uppercase tracking-tight">
        {c.recentTitle}
      </h2>
      <div className="mt-4 overflow-x-auto rounded-base border border-border">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">{c.tableHeaders.product}</th>
              <th className="px-4 py-3 font-medium">{c.tableHeaders.lab}</th>
              <th className="px-4 py-3 font-medium">{c.tableHeaders.batch}</th>
              <th className="px-4 py-3 font-medium">{c.tableHeaders.date}</th>
              <th className="px-4 py-3 text-right font-medium">
                {c.tableHeaders.report}
              </th>
            </tr>
          </thead>
          <tbody>
            {batches.map(({ product, report }) => (
              <tr
                key={report.batch}
                className="border-b border-border last:border-0"
              >
                <td className="px-4 py-3 font-medium">{product}</td>
                <td className="px-4 py-3 text-muted">{report.lab}</td>
                <td className="num px-4 py-3">{report.batch}</td>
                <td className="num px-4 py-3 text-muted">
                  {formatDate(report.testedOn)}
                </td>
                <td className="px-4 py-3 text-right">
                  <a
                    href={report.documentUrl}
                    className="inline-flex items-center gap-1 text-accent hover:underline"
                  >
                    <FileCheck2 className="size-3.5" aria-hidden />
                    PDF
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
