import Link from "next/link";
import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import {
  Landmark,
  Bitcoin,
  CircleDollarSign,
  Clock,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";
import { SITE } from "@/lib/constants";
import type { LocaleCode } from "@/types";
import contentByLocale from "./content.json";

interface Method {
  key: string;
  name: string;
  steps: string;
  confirm: string;
}
interface Issue {
  label: string;
  text: string;
}
interface PaymentGuideContent {
  metaTitle: string;
  metaDescription: string;
  title: string;
  intro: string;
  methodsHeading: string;
  methods: Method[];
  cardsNote: string;
  issuesHeading: string;
  issues: Issue[];
  pendingBefore: string;
  pendingLink: string;
  pendingAfter: string;
  refundsTitle: string;
  refundsBefore: string;
  refundsLink: string;
  refundsAfter: string;
  securityTitle: string;
  securityBody: string;
  questionsBefore: string;
  questionsLink: string;
  questionsAfter: string;
}

const CONTENT = contentByLocale as Record<
  LocaleCode,
  PaymentGuideContent | null
>;

function pick(locale: LocaleCode): PaymentGuideContent {
  return CONTENT[locale] ?? (CONTENT.it as PaymentGuideContent);
}

const METHOD_ICONS: Record<string, typeof Landmark> = {
  bank: Landmark,
  btc: Bitcoin,
  usdt: CircleDollarSign,
};

export async function generateMetadata(): Promise<Metadata> {
  const c = pick((await getLocale()) as LocaleCode);
  return { title: c.metaTitle, description: c.metaDescription };
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-base border border-border bg-surface p-5">
      {children}
    </div>
  );
}

export default async function PaymentGuidePage() {
  const c = pick((await getLocale()) as LocaleCode);
  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        {SITE.name}
      </p>
      <h1 className="font-display mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl">
        {c.title}
      </h1>
      <p className="mt-4 text-pretty text-muted">{c.intro}</p>

      {/* Metodi disponibili */}
      <h2 className="mt-10 text-sm font-semibold uppercase tracking-tight">
        {c.methodsHeading}
      </h2>
      <div className="mt-4 flex flex-col gap-4">
        {c.methods.map((m) => {
          const Icon = METHOD_ICONS[m.key] ?? Landmark;
          return (
            <Card key={m.key}>
              <div className="flex items-center gap-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-accent">
                  <Icon className="size-5" aria-hidden />
                </span>
                <h3 className="text-sm font-semibold">{m.name}</h3>
              </div>
              <p className="mt-3 text-sm text-muted">{m.steps}</p>
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
                <Clock className="size-3.5 text-accent" aria-hidden />
                {m.confirm}
              </p>
            </Card>
          );
        })}
      </div>
      <p className="mt-3 text-sm text-muted">{c.cardsNote}</p>

      {/* Problemi comuni */}
      <h2 className="mt-10 flex items-center gap-2 text-sm font-semibold uppercase tracking-tight">
        <AlertTriangle className="size-5 text-accent" aria-hidden />
        {c.issuesHeading}
      </h2>
      <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-sm text-muted">
        {c.issues.map((it) => (
          <li key={it.label}>
            <span className="font-medium text-text">{it.label}</span> {it.text}
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-base border border-accent/30 bg-accent-soft/40 px-4 py-3 text-sm">
        {c.pendingBefore}{" "}
        <a
          href={SITE.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent hover:underline"
        >
          {c.pendingLink}
        </a>
        {c.pendingAfter}
      </p>

      {/* Rimborsi / Sicurezza */}
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold">{c.refundsTitle}</h3>
          <p className="mt-2 text-sm text-muted">
            {c.refundsBefore}{" "}
            <Link
              href="/legal/shipping-and-returns"
              className="text-accent hover:underline"
            >
              {c.refundsLink}
            </Link>
            {c.refundsAfter}
          </p>
        </Card>
        <Card>
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="size-4 text-accent" aria-hidden />
            {c.securityTitle}
          </h3>
          <p className="mt-2 text-sm text-muted">{c.securityBody}</p>
        </Card>
      </div>

      <p className="mt-8 text-sm text-muted">
        {c.questionsBefore}{" "}
        <a
          href={SITE.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent hover:underline"
        >
          {c.questionsLink}
        </a>{" "}
        {c.questionsAfter}
      </p>
    </div>
  );
}
