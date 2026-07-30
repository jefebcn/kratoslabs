# KratosLabs — contesto di progetto

Leggi questo file prima di ogni task. Contiene stack, convenzioni e vincoli.
Non ripeterti in chat: se una regola è qui, applicala e basta.

## Cos'è

E-commerce di nutrizione sportiva e integratori. Catalogo: proteine, creatina,
elettroliti, omega-3, pre-workout. Prodotti legali, venduti al pubblico, spediti
con corriere tracciato standard.

Fuori scope, non implementare mai: farmaci soggetti a prescrizione, composti
anabolizzanti, SARM, sostanze non approvate; feature di "stealth shipping",
re-ship guarantee, o pagamenti impostati per eludere i controlli.

## Stack

- Next.js 15 (App Router, Server Actions) — `next@latest`
- TypeScript, `strict: true`, nessun `any` implicito
- Tailwind CSS v4 (config CSS-first in `globals.css`, non `tailwind.config.js`)
- shadcn/ui + Radix primitives per i componenti base
- Zustand per stato carrello (persist su localStorage)
- Framer Motion, usato con parsimonia (vedi Motion)
- Deploy: Vercel

## Architettura

```
src/
  app/
    (shop)/          storefront: home, catalogo, PDP, legal
    (admin)/         dashboard, gestione prodotti, gestione ordini
    (auth)/          login, register
    api/             route handlers
  components/
    ui/              base shadcn (button, dialog, sheet, tabs, input)
    layout/          Header, Topbar, MegaMenu, Footer, AdminSidebar
    product/         ProductCard, ProductGrid, ProductGallery, SpecsTable
    cart/            CartDrawer, CartLineItem, CartSummary
    admin/           DataTable, StatCard, ProductForm, OrderStatusSelect
  features/          logica di dominio (store, server actions, calcoli)
    cart/ products/ checkout/ admin/
  lib/               utils, costanti, dati mock, schemi di validazione
  types/             interfacce condivise
  hooks/             hook riutilizzabili
```

Regole di factorizzazione, non negoziabili:

1. Un file per componente. Se un file supera ~150 righe, va spezzato.
2. I componenti in `components/` sono presentazionali. Nessuna fetch, nessun
   calcolo di business dentro un componente: quello vive in `features/`.
3. Ogni cartella `features/*` espone un `index.ts` come unico punto di import.
4. `"use client"` solo dove serve davvero (stato, effetti, event handler).
   Default: Server Component.
5. Niente valori hardcoded nei componenti. Testi ricorrenti, categorie e
   configurazioni stanno in `lib/constants.ts`.
6. I tipi si importano da `@/types`. Non ridichiarare interfacce locali.

## Design system

Direzione: precisione da laboratorio. Scuro, denso di dati, poco decorato.
Il contrasto lo fa la tipografia e lo spazio, non i gradienti.

Token in `src/app/globals.css`, usa solo quelli:

| Token | Valore | Uso |
|---|---|---|
| `--bg` | `#0B0C0E` | fondo pagina |
| `--surface` | `#14161A` | card, drawer, header |
| `--border` | `#23262C` | hairline, divisori |
| `--text` | `#F2F3F5` | testo primario |
| `--muted` | `#8A9099` | label, meta, unità |
| `--accent` | `#DC2626` | rosso Kratos: CTA, prezzi, focus, stati attivi |
| `--danger` | `#B91C1C` | errori, elimina, stock esaurito |

Brand: rosso (`--accent`) + bianco (`--text`) su base scura, ispirati al
personaggio (striscia rossa, pelle chiara). Testo su `--accent` sempre bianco.

Tipografia: display e numeri in un grotesque a larghezza fissa per le cifre
(`font-variant-numeric: tabular-nums` su ogni prezzo e dato tecnico), body in
un sans neutro. I dati tecnici sono il contenuto, quindi devono allinearsi in
colonna: mai cifre proporzionali in tabelle o card.

Border radius: 4px, uniforme. Nessuna ombra colorata, nessun glow.

## Motion

- Solo tre casi: apertura drawer/dialog, hover su card, reveal in viewport delle
  sezioni home. Nient'altro.
- Durata 150–250ms, easing `[0.16, 1, 0.3, 1]`.
- Rispetta sempre `prefers-reduced-motion`.

## Quality floor

Ogni cosa che consegni deve già essere: responsive fino a 360px, navigabile da
tastiera con focus visibile, con `alt` sulle immagini, e senza errori
`next build`. Non è un extra da chiedere.

## Come lavoriamo

Un task per volta. Alla fine di ogni task: elenca i file creati o modificati e
fermati. Non anticipare lo step successivo, non creare file non richiesti.
Se una scelta è ambigua, fai la domanda invece di indovinare.
