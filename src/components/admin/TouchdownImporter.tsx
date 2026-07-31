"use client";

import { useEffect, useRef, useState } from "react";
import { Bookmark, Check, Copy } from "lucide-react";

/**
 * Bookmarklet per importare le foto della sezione "Galleria Touchdown" dalla
 * home di deuspower. Gira nel browser dell'admin (che passa Cloudflare) e le
 * carica nella nostra galleria.
 */
export function TouchdownImporter({ bookmarklet }: { bookmarklet: string }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    linkRef.current?.setAttribute("href", bookmarklet);
  }, [bookmarklet]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(bookmarklet);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard non disponibile */
    }
  }

  return (
    <div className="rounded-base border border-accent/30 bg-accent-soft/40 p-5">
      <h2 className="text-sm font-semibold">
        Importa la Galleria Touchdown (dal browser)
      </h2>
      <p className="mt-1 text-sm text-muted">
        Prende le foto della sezione <strong>&quot;Galleria Touchdown&quot;</strong>{" "}
        dalla home di deuspower e le carica nella tua galleria.
      </p>

      <ol className="mt-4 flex list-decimal flex-col gap-1.5 pl-5 text-sm text-muted">
        <li>
          Trascina questo pulsante nella{" "}
          <strong className="text-text">barra dei preferiti</strong>:
          <div className="mt-2">
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              ref={linkRef}
              href="#"
              onClick={(e) => e.preventDefault()}
              draggable
              className="inline-flex items-center gap-2 rounded-base border border-accent bg-white px-3 py-2 text-sm font-semibold text-accent"
            >
              <Bookmark className="size-4" aria-hidden />
              Importa Touchdown → KratosLabs
            </a>
            <button
              type="button"
              onClick={copy}
              className="ml-2 inline-flex items-center gap-1 rounded-base border border-border bg-surface px-2 py-2 text-xs font-medium transition-colors hover:text-accent"
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-accent" aria-hidden /> Copiato
                </>
              ) : (
                <>
                  <Copy className="size-3.5" aria-hidden /> Copia codice
                </>
              )}
            </button>
          </div>
        </li>
        <li>
          Apri la <strong className="text-text">home di deuspower</strong> e
          scorri fino alla sezione &quot;Galleria Touchdown&quot;.
        </li>
        <li>
          Clicca il preferito: le foto vengono caricate e in basso a destra
          vedrai l&apos;avanzamento.
        </li>
        <li>Torna qui e ricarica: le foto compaiono nella galleria qui sotto.</li>
      </ol>

      <p className="mt-3 text-xs text-muted">
        Se il browser non permette di trascinare, usa &quot;Copia codice&quot; e
        crea un preferito incollandolo come indirizzo/URL.
      </p>
    </div>
  );
}
