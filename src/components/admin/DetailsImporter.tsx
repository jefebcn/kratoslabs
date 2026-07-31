"use client";

import { useEffect, useRef, useState } from "react";
import { Bookmark, Check, Copy } from "lucide-react";

/**
 * Bookmarklet per importare le SCHEDE DESCRITTIVE dei prodotti da deuspower.
 * Apre ogni scheda prodotto, ne estrae la descrizione (Product Overview, Key
 * Features, Benefits, ecc.), la sanifica e la salva sul prodotto abbinato.
 */
export function DetailsImporter({ bookmarklet }: { bookmarklet: string }) {
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
        Importa le schede descrittive (dal browser)
      </h2>
      <p className="mt-1 text-sm text-muted">
        Apre ogni scheda prodotto su deuspower, ne prende la{" "}
        <strong>descrizione completa</strong> (Panoramica, Caratteristiche,
        Benefici, Uso, Avvertenze…) e la salva sul prodotto corrispondente.
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
              Importa schede → KratosLabs
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
          Apri su deuspower la pagina{" "}
          <strong className="text-text">Tutti i prodotti</strong> (più prodotti
          possibile per pagina).
        </li>
        <li>
          Clicca il preferito: apre ogni scheda una alla volta, quindi impiega
          qualche minuto. In basso a destra vedrai l&apos;avanzamento — lascia
          la scheda aperta fino a &quot;Fatto&quot;.
        </li>
        <li>
          Ricarica una scheda prodotto sul sito: la descrizione completa
          comparirà nella tab &quot;Descrizione&quot;.
        </li>
      </ol>
    </div>
  );
}
