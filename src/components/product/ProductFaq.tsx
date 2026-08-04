import { ChevronDown } from "lucide-react";
import type { ProductFaq as Faq } from "@/types";

/**
 * Elenco FAQ a fisarmonica: usa <details>/<summary> nativi (accessibile,
 * nessun JavaScript). Ogni riga si espande al clic.
 */
export function ProductFaq({ title, faqs }: { title: string; faqs: Faq[] }) {
  if (!faqs.length) return null;
  return (
    <section className="mt-16 max-w-3xl scroll-mt-24" id="faq">
      <h2 className="text-lg font-semibold uppercase tracking-tight">{title}</h2>
      <div className="mt-5 divide-y divide-border border-y border-border">
        {faqs.map((f, i) => (
          <details key={i} className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
              {f.q}
              <ChevronDown
                className="size-4 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <p className="max-w-prose text-pretty pb-4 text-sm leading-relaxed text-muted">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
