# KratosLabs

E-commerce di nutrizione sportiva. Next.js 15 (App Router), TypeScript strict,
Tailwind v4, Zustand.

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
| `npm run lint` | eslint |

## Struttura

Vedi `CLAUDE.md` per architettura, design token e convenzioni.
Vedi `PROMPTS.md` per la sequenza di sviluppo.

## Stato

Fondazione pronta: config, token, tipi, utils, costanti, dati mock.
Componenti e pagine: da costruire seguendo `PROMPTS.md`.

## Deploy su Vercel

1. Push su GitHub.
2. Su Vercel: New Project, importa il repo. Framework rilevato automaticamente.
3. Aggiungi le variabili di `.env.example` in Settings, Environment Variables.
4. Deploy.
