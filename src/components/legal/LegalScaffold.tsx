import Link from "next/link";
import { LEGAL_LINKS } from "@/lib/constants";

export interface LegalSectionData {
  id: string;
  title: string;
  body?: string;
  /** Punti che restano da far scrivere/verificare a un legale. */
  todo?: string[];
}

export function LegalScaffold({
  title,
  updated,
  intro,
  sections,
}: {
  title: string;
  updated: string;
  intro?: string;
  sections: LegalSectionData[];
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">
            Documenti
          </p>
          <nav className="mt-3 flex flex-col gap-1">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-muted transition-colors hover:text-text"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <p className="mt-6 text-xs font-medium uppercase tracking-wide text-muted">
            In questa pagina
          </p>
          <nav className="mt-3 flex flex-col gap-1">
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="text-sm text-muted transition-colors hover:text-text"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </aside>

        <article>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-2 text-sm text-muted">
            Ultimo aggiornamento: {updated}
          </p>
          {intro && (
            <p className="mt-6 max-w-prose text-pretty text-muted">{intro}</p>
          )}

          <div className="mt-10 flex flex-col gap-10">
            {sections.map((s) => (
              <section key={s.id} id={s.id} className="scroll-mt-24">
                <h2 className="text-lg font-semibold tracking-tight">
                  {s.title}
                </h2>
                {s.body && (
                  <p className="mt-3 max-w-prose text-pretty text-muted">
                    {s.body}
                  </p>
                )}
                {s.todo && (
                  <div className="mt-4 rounded-base border border-dashed border-border p-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-accent">
                      [Da compilare]
                    </p>
                    <ul className="mt-2 list-disc pl-5 text-sm text-muted">
                      {s.todo.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}
