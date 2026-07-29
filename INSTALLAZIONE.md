# Installazione — procedura con GitHub Desktop

Il repo attuale ha la struttura appiattita: `globals.css` e
`placeholder-product.svg` stanno alla radice invece che nelle loro cartelle, non
esiste `src/`, e ci sono tre `.zip` committati per errore. Va ripulito, non
corretto file per file.

## Regola che evita il problema

Non trascinare mai i file dentro la pagina di upload di GitHub nel browser: se
trascini file annidati, li appiattisce. E non tirare i file fuori dalla finestra
di anteprima di uno zip. Estrai lo zip in una cartella, poi lavora con GitHub
Desktop.

## Procedura

**1. Estrai lo zip per davvero**

Windows: click destro sullo zip, "Estrai tutto".
macOS: doppio click sullo zip.

Ottieni una cartella `kratoslabs` che contiene `src`, `public`, `package.json`.
Verifica che `src/app` esista e contenga `layout.tsx`: se non c'è, l'estrazione
è andata male e va rifatta.

**2. Svuota il repo locale**

In GitHub Desktop: Current Repository, seleziona `kratoslabs`, poi
Repository, Show in Explorer (o Finder). Si apre la cartella locale del repo.

Cancella tutto quello che c'è dentro **tranne** la cartella nascosta `.git`.
Se non vedi `.git`, va bene: significa che è nascosta, quindi non rischi di
cancellarla selezionando tutto il resto.

Su Windows i file nascosti si mostrano da Visualizza, Elementi nascosti.
Su macOS con Cmd+Shift+punto.

**3. Copia dentro il progetto corretto**

Apri la cartella `kratoslabs` estratta al punto 1. Entra dentro, seleziona
**tutto il contenuto** (le cartelle `src` e `public` incluse, non i file uno per
uno) e copialo nella cartella locale del repo.

Importante: devi copiare anche i file nascosti `.gitignore` e `.env.example`.
Attiva la visualizzazione degli elementi nascosti prima di selezionare, oppure
copia la cartella intera e poi sposta il contenuto.

Se `.gitignore` non arriva nel repo, al primo commit GitHub Desktop proverà a
caricare `node_modules`: migliaia di file. Se vedi un numero di modifiche a
quattro cifre, fermati, il `.gitignore` manca.

**4. Commit**

Torna su GitHub Desktop. Nella lista modifiche devi vedere:

- in verde i file nuovi con percorso `src/...` e `public/...`
- in rosso le rimozioni: i tre `.zip`, `globals.css` e `placeholder-product.svg`
  dalla radice

Se vedi ancora i `.zip` tra i file presenti e non tra i rimossi, cancellali
dalla cartella locale.

Messaggio di commit: `fix: ripristino struttura cartelle del progetto`

Poi Commit to main, e Push origin.

**5. Verifica**

Apri il repo su GitHub. Alla radice devi vedere `src` e `public` come cartelle,
e nessun file `.zip`. Entra in `src/app`: devono esserci `layout.tsx`,
`not-found.tsx`, `globals.css` e la cartella `(shop)`.

Se è così, Vercel builda da solo e passa.

## Se hai Node installato

Prima di pushare, dalla cartella del repo:

```bash
npm install
npm run build
```

Deve finire con quattro pagine statiche generate. Se non hai Node, salta: Vercel
fa lo stesso build sui suoi server.

## Contenuto atteso del progetto

```
kratoslabs/
  .gitignore
  .env.example
  CLAUDE.md
  PROMPTS.md
  README.md
  INSTALLAZIONE.md
  package.json
  tsconfig.json
  next.config.ts
  postcss.config.mjs
  public/
    images/placeholder-product.svg
  src/
    app/
      globals.css
      layout.tsx
      not-found.tsx
      (shop)/
        layout.tsx
        page.tsx
      (admin)/ (auth)/ api/     -> vuote, si popolano dai task
    components/ features/ hooks/ styles/   -> vuote
    lib/
      constants.ts
      mock-data.ts
      utils.ts
    types/
      index.ts
```
