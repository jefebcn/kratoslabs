# KratosLabs

E-commerce di nutrizione sportiva. Next.js 15 (App Router, Server Actions),
TypeScript strict, Tailwind v4, Zustand, Radix UI, Framer Motion.

Direzione: precisione da laboratorio. Dark mode nativo, dati densi, accento
ottone. Ogni prodotto mostra il **prezzo per grammo di attivo** come metro di
paragone reale.

## Avvio

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | server di sviluppo su :3000 |
| `npm run build` | build di produzione (quella che gira su Vercel) |
| `npm run typecheck` | `tsc --noEmit`, da lanciare prima di ogni commit |
| `npm run lint` | eslint (`next lint`) |

## Struttura

```
src/
  app/
    (shop)/            storefront: home, catalogo, PDP, checkout, legal, guide
    (admin)/admin/     dashboard, gestione prodotti (+ form), gestione ordini
    (auth)/            login, register
    api/               route handlers (health, products)
    layout.tsx  globals.css  not-found.tsx  icon.svg
  components/
    ui/                base shadcn/Radix: button, input, sheet, dialog, tabs,
                       dropdown-menu, select, badge, card, money, reveal, icon…
    layout/            Topbar, Header, MegaMenu, SearchBar, Footer, AdminSidebar…
    product/           ProductCard, ProductGrid, ProductGallery, SpecsTable,
                       LabReportCard, QuantitySelector, ProductPurchasePanel…
    cart/              CartButton, CartDrawer, CartLineItem, CartSummary
    checkout/  admin/  legal/  auth/
  features/            logica di dominio, un index.ts per cartella
    cart/ products/ checkout/ admin/ preferences/
  lib/                 utils, costanti, dati mock, schemi zod
  types/               interfacce condivise
  hooks/               use-has-mounted, use-media-query
```

Convenzioni, design token e regole di factorizzazione: vedi `CLAUDE.md`.
Sequenza di sviluppo storica: vedi `PROMPTS.md`.

## Cosa è implementato

- **Storefront**: homepage (hero, trust badge, griglia in evidenza, categorie,
  band community/Bitcoin, gallery "ordini arrivati"), catalogo con filtri per
  categoria e ricerca, PDP con gallery, tab specifiche e referto di laboratorio,
  selettore quantità con sconti quantità.
- **Carrello**: store Zustand persistente, drawer slide-out, sconti a scaglioni,
  soglia spedizione gratuita, valuta commutabile (EUR/USD/GBP, solo display).
- **Checkout**: form validato con Zod tramite Server Action (demo, nessun
  pagamento reale), riepilogo carrello.
- **Admin** (`/admin`): dashboard con metriche e grafico ricavi, gestione
  prodotti con form (campi tecnici: principio attivo, dosaggio, porzioni),
  gestione ordini con selettore di stato.
- **Legali**: privacy (struttura GDPR), termini, spedizioni e resi, con le
  sezioni da far compilare a un legale marcate `[Da compilare]`.
- **Contenuti**: guide, recensioni, analisi di laboratorio.

I dati provengono da `lib/mock-data.ts` (5 prodotti, 2 ordini). Le firme delle
funzioni in `features/*` restano stabili: sostituendo il mock con un DB, i
componenti non cambiano.

## Deploy su Vercel

1. Push su GitHub.
2. Su Vercel: New Project, importa il repo. Il framework è rilevato in automatico
   (imposta la Root Directory su `kratoslabs/` se il repo la annida).
3. Aggiungi le variabili di `.env.example` in Settings → Environment Variables.
4. Deploy.
