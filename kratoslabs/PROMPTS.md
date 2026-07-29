# Sequenza di prompt per Claude Code

Il tuo prompt originale chiedeva circa venti deliverable in un turno: init,
struttura, layout, header, mega-menu, home, product card, PDP, admin, legali,
config Vercel. Il sovraccarico non era la lunghezza, era il numero di decisioni
indipendenti da prendere contemporaneamente.

La regola: **il contesto sta nel file, i task stanno nella chat.** Tutto quello
che vale per ogni task (stack, palette, regole di factorizzazione) sta in
`CLAUDE.md` e non lo ripeti mai. In chat mandi un task per volta, con un
criterio di completamento verificabile.

## Come iniziare

```bash
cd kratoslabs
npm install
claude
```

Claude Code legge `CLAUDE.md` da solo all'avvio. Primo messaggio:

> Leggi CLAUDE.md. Poi conferma in tre righe: stack, regole di factorizzazione,
> token colore. Non scrivere codice.

Serve a verificare che abbia caricato il contesto prima di produrre.

## I task, uno per messaggio

**1 — Verifica base**

> Fai partire `npm run dev` e `npm run typecheck`. Se qualcosa manca per far
> compilare il progetto (root layout, next-env), crealo minimale. Nient'altro.

**2 — Componenti base UI**

> In `src/components/ui` crea: Button (varianti primary, ghost, danger, con
> stati disabled e loading), Input, Badge, Sheet, Tabs. Solo Tailwind e Radix,
> solo i token di CLAUDE.md. Un file per componente, tipizzati con
> `ComponentProps`. Fermati e elencami i file.

**3 — Layout e Header**

> Crea `src/app/(shop)/layout.tsx` e in `src/components/layout`: Topbar (usa
> ANNOUNCEMENTS da lib/constants), Header, MegaMenu (categorie da CATEGORIES),
> Footer. Il MegaMenu è l'unico componente client di questo gruppo. Ricerca e
> valuta come segnaposto non funzionanti, li colleghiamo dopo.

**4 — Carrello**

> Crea lo store Zustand in `src/features/cart` con persist: add, remove,
> setQuantity, clear, e i selettori per subtotale e sconto quantità usando
> BULK_TIERS. Poi `src/components/cart/CartDrawer.tsx` con Sheet. Test manuale:
> aggiungo tre pezzi dello stesso prodotto e vedo applicato il 5%.

**5 — Product card e griglia**

> Crea ProductCard e ProductGrid in `src/components/product`. La card mostra
> brand, titolo, descrizione breve, prezzo, e il prezzo per grammo di attivo
> calcolato con `formatPricePerActiveGram` da lib/utils. Se stock è 0, stato
> esaurito e bottone disabilitato. Dati da MOCK_PRODUCTS.

**6 — Homepage**

> Assembla `src/app/(shop)/page.tsx`: hero, sezione con i tre claim, griglia
> dei prodotti in evidenza. Server Component, niente animazioni per ora.

**7 — PDP**

> Crea `src/app/(shop)/products/[slug]/page.tsx` con generateStaticParams e
> generateMetadata. Gallery, tabella specifiche da ProductSpecs, tab con il
> referto di laboratorio, selettore quantità che mostra lo sconto raggiunto.

**8 — Admin**

> Crea il layout admin con sidebar, la dashboard con quattro StatCard e la
> tabella ordini recenti da MOCK_ORDERS, e le due pagine prodotti e ordini.
> Il selettore di stato ordine aggiorna solo lo stato locale per ora.

**9 — Pagine legali**

> Scaffolda le tre pagine sotto `(shop)/legal` con una struttura di sezioni
> corretta e testo segnaposto marcato `[DA COMPILARE]`. Non inventare clausole
> legali: mettimi solo l'impalcatura e l'elenco di cosa devo far scrivere.

**10 — Motion**

> Aggiungi Framer Motion solo nei tre casi previsti da CLAUDE.md. Verifica che
> con `prefers-reduced-motion` sia tutto fermo.

## Regole che riducono gli intoppi

1. **Un task, un commit.** `git commit` dopo ogni task riuscito. Se il task 6
   va male, torni indietro di un passo, non di dieci.
2. **`/clear` tra i task.** Il contesto sporco è la causa principale delle
   allucinazioni su file che non esistono. `CLAUDE.md` viene ricaricato, quindi
   non perdi niente di importante.
3. **Chiedi il piano prima del codice** sui task grossi: "prima elencami i file
   che creerai, poi aspetta il mio ok". Correggere un elenco costa niente,
   correggere dieci file costa una sessione.
4. **Niente `--dangerously-skip-permissions`** su un progetto nuovo. Vuoi vedere
   cosa scrive dove, almeno per i primi task.
5. **Se sbaglia due volte la stessa cosa, la regola va in `CLAUDE.md`,** non
   ripetuta in chat. La chat la dimentica, il file no.
6. **Un chiarimento vale più di una riscrittura.** Se il task è ambiguo, dillo
   nel prompt: "se qualcosa non è definito, chiedi invece di decidere".

## Cosa manca ancora al progetto

Da affrontare dopo lo step 10, ognuno con la stessa logica del task singolo:
database e schema, autenticazione, checkout e pagamenti reali, gestione
immagini, i18n per la lingua, ricerca, email trasazionali, SEO e sitemap.
