"use client";

import { useEffect, useRef, useState } from "react";
import { Bookmark, Check, Copy } from "lucide-react";

/**
 * Mostra il "bookmarklet" da trascinare nella barra dei preferiti. Il download
 * delle immagini avviene nel browser dell'admin (che accede a deuspower senza
 * blocchi Cloudflare) e le carica sul nostro sito abbinandole per nome.
 */
export function BrowserImageImporter({ bookmarklet }: { bookmarklet: string }) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const [copied, setCopied] = useState(false);

  // React blocca gli href "javascript:"; lo impostiamo via DOM.
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
        Importa dal browser (consigliato)
      </h2>
      <p className="mt-1 text-sm text-muted">
        deuspower e deusmedical bloccano il nostro server (Cloudflare). Questo
        metodo usa il <strong>tuo browser</strong>: apre ogni scheda prodotto,
        scarica <strong>tutte le foto della galleria</strong> nello stesso
        ordine del sito sorgente e le carica qui, abbinandole ai prodotti per
        nome.
      </p>

      <ol className="mt-4 flex list-decimal flex-col gap-1.5 pl-5 text-sm text-muted">
        <li>
          Trascina questo pulsante nella{" "}
          <strong className="text-text">barra dei preferiti</strong> del
          browser:
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
              Importa immagini → KratosLabs
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
          <strong className="text-text">Tutti i prodotti</strong> (mostra più
          prodotti possibile per pagina).
        </li>
        <li>
          Clicca il preferito appena creato: aprirà ogni scheda una alla volta
          per prenderne tutte le foto, quindi impiega qualche minuto. In basso a
          destra vedrai l&apos;avanzamento (prodotti e foto). Lascia la scheda
          aperta fino a &quot;Fatto&quot;.
        </li>
        <li>
          Torna qui e ricarica: i prodotti abbinati avranno la foto. Il tasto
          scade dopo qualche ora — ricarica questa pagina per rigenerarlo.
        </li>
      </ol>

      <p className="mt-3 text-xs text-muted">
        Se il browser non permette di trascinare, usa &quot;Copia codice&quot; e
        crea un nuovo preferito incollandolo come indirizzo/URL.
      </p>
    </div>
  );
}
