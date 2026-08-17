import type {
  BulkTier,
  Category,
  CurrencyMeta,
  DashboardMetric,
  GalleryItem,
  LocaleMeta,
  NavLink,
  OrderStatusMeta,
  PaymentMethod,
  SalesPoint,
  TrustBadge,
} from "@/types";

export const SITE = {
  name: "KratosLabs",
  tagline: "Integratori testati, dosaggi dichiarati.",
  description:
    "Integratori per lo sport con dosaggi dichiarati e analisi di terza parte su ogni lotto.",
  email: "kratoslabs-eu@proton.me",
  telegramUrl: "https://t.me/kratoslabs",
  instagramUrl: "https://www.instagram.com/kratoslabs.official",
  tiktokUrl: "https://www.tiktok.com/@kratoslab.official",
} as const;

/** Barra annuncio. Tre claim, tutti verificabili. */
export const ANNOUNCEMENTS = [
  "Analisi di terza parte su ogni lotto",
  "Spedizione tracciata in 2–4 settimane",
  "Spedizione gratuita sopra i 180 €",
  "Reso entro 30 giorni",
] as const;

export const CATEGORIES: Category[] = [
  {
    slug: "iniettabili",
    name: "Iniettabili",
    description: "Soluzioni sterili in fiale per uso intramuscolare.",
  },
  {
    slug: "orali",
    name: "Orali",
    description: "Compresse in blister per uso orale.",
  },
  {
    slug: "post-cycle",
    name: "Post Cycle (PCT)",
    description: "SERM, inibitori dell'aromatasi e supporto ormonale.",
  },
  {
    slug: "brucia-grassi",
    name: "Brucia grassi",
    description: "Termogenici, ormoni tiroidei e agonisti GLP-1.",
  },
  {
    slug: "sex-support",
    name: "Sex Support",
    description: "Supporto per la funzione sessuale.",
  },
  {
    slug: "hgh-peptidi",
    name: "HGH & Peptidi",
    description: "Ormone della crescita e peptidi.",
  },
  {
    slug: "sarms",
    name: "SARMs",
    description: "Modulatori selettivi del recettore degli androgeni.",
  },
  {
    slug: "salute",
    name: "Salute",
    description: "Supporto cardiovascolare, colesterolo e accessori.",
  },
];

/**
 * Sconti quantità disattivati: nessuno sconto sulle quantità maggiori di 1.
 * `priceLine`/`bulkDiscountFor` restano funzionanti ma senza soglie applicano
 * sempre sconto 0. Per riattivarli, ripopolare questo elenco.
 */
export const BULK_TIERS: BulkTier[] = [];

// Spedizione a tariffa unica (gratuita sopra soglia): vedi `src/lib/shipping.ts`.

export const NAV_LINKS: readonly NavLink[] = [
  { href: "/guide", label: "Guide" },
  { href: "/recensioni", label: "Recensioni" },
  { href: "/analisi", label: "Analisi di laboratorio" },
] as const;

export const LEGAL_LINKS: readonly NavLink[] = [
  { href: "/legal/privacy-policy", label: "Privacy policy" },
  { href: "/legal/terms-of-service", label: "Termini di servizio" },
  { href: "/legal/shipping-and-returns", label: "Spedizioni e resi" },
] as const;

/* -------------------------------------------------------------------------- */
/*  Valute e lingue                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Tassi indicativi, solo per la visualizzazione. In produzione arrivano da un
 * servizio di cambio; qui restano statici per rendere l'UI provabile.
 */
export const CURRENCIES: Record<string, CurrencyMeta> = {
  EUR: { code: "EUR", symbol: "€", locale: "it-IT", rateFromEur: 1 },
  USD: { code: "USD", symbol: "$", locale: "en-US", rateFromEur: 1.08 },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB", rateFromEur: 0.85 },
};

export const DEFAULT_CURRENCY = "EUR" as const;

export const LOCALES: LocaleMeta[] = [
  { code: "it", label: "Italiano", short: "IT" },
  { code: "en", label: "English", short: "EN" },
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "fr", label: "Français", short: "FR" },
  { code: "pt", label: "Português", short: "PT" },
];

export const DEFAULT_LOCALE = "it" as const;

/** Cookie che conserva la lingua scelta (leggibile lato server da next-intl). */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/* -------------------------------------------------------------------------- */
/*  Sezioni di homepage                                                       */
/* -------------------------------------------------------------------------- */

export const HERO = {
  eyebrow: "Nutrizione sportiva, misurata",
  title: "La dose che leggi in etichetta è la dose che ricevi.",
  subtitle:
    "Formule a etichetta aperta, ogni lotto analizzato da un laboratorio indipendente. Nessun proprietary blend, nessuna promessa che non possiamo certificare.",
  primaryCta: { label: "Esplora il catalogo", href: "/products" },
  secondaryCta: { label: "Come testiamo", href: "/analisi" },
} as const;

export const TRUST_BADGES: TrustBadge[] = [
  {
    icon: "FlaskConical",
    title: "Analisi indipendenti",
    description:
      "Referto di terza parte pubblicato per ogni lotto, con numero di batch verificabile.",
  },
  {
    icon: "Truck",
    title: "Spedizione tracciata",
    description:
      "Corriere tracciato, consegna in 2–4 settimane; imballo neutro e riciclabile su richiesta.",
  },
  {
    icon: "ShieldCheck",
    title: "Reso a 30 giorni",
    description:
      "Se un prodotto non ti convince, lo rendi entro 30 giorni. Rimborso pieno.",
  },
  {
    icon: "CreditCard",
    title: "Pagamenti sicuri",
    description:
      "Carte, PayPal, bonifico e criptovalute. Checkout cifrato, nessun dato conservato.",
  },
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: "crypto", label: "Crypto (BTC/USDT)", icon: "Bitcoin" },
  { id: "bank", label: "Bonifico", icon: "Landmark" },
  { id: "cards", label: "Carte", icon: "CreditCard", disabled: true },
  { id: "paypal", label: "PayPal", icon: "Wallet", disabled: true },
];

/** Metodi realmente accettati al checkout: mostrati nella banda che ruota. */
export const ACCEPTED_PAYMENTS = [
  { name: "Bitcoin", subtitle: "BTC — privato e veloce", icon: "Bitcoin" },
  { name: "USDT", subtitle: "TRC-20 — stablecoin", icon: "CircleDollarSign" },
  {
    name: "Bonifico bancario",
    subtitle: "SEPA — conferma in 24–48h",
    icon: "Landmark",
  },
] as const;

/**
 * "Dalla community": foto reali inviate dai clienti. Prova sociale onesta,
 * non pacchi anonimi. In produzione arrivano moderate da un CMS.
 */
export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: "g_01",
    imageUrl: "/images/gallery/tile-a.svg",
    alt: "Confezione ISO Zero accanto a uno shaker su un banco da cucina",
    author: "Marco R.",
    location: "Milano",
    span: 2,
  },
  {
    id: "g_02",
    imageUrl: "/images/gallery/tile-b.svg",
    alt: "Barattolo di creatina appena ricevuto, sigillo integro",
    author: "Sara T.",
    location: "Torino",
    span: 1,
  },
  {
    id: "g_03",
    imageUrl: "/images/gallery/tile-c.svg",
    alt: "Pre-workout Ignition dosato in un misurino",
    author: "Luca B.",
    location: "Bologna",
    span: 1,
  },
  {
    id: "g_04",
    imageUrl: "/images/gallery/tile-d.svg",
    alt: "Kit omega-3 ed elettroliti sopra una borsa da palestra",
    author: "Giulia M.",
    location: "Roma",
    span: 2,
  },
  {
    id: "g_05",
    imageUrl: "/images/gallery/tile-e.svg",
    alt: "Referto di laboratorio stampato accanto al prodotto",
    author: "Davide P.",
    location: "Napoli",
    span: 1,
  },
  {
    id: "g_06",
    imageUrl: "/images/gallery/tile-f.svg",
    alt: "Confezione neutra aperta con prodotto e foglietto lotto",
    author: "Elena V.",
    location: "Firenze",
    span: 1,
  },
];

/* -------------------------------------------------------------------------- */
/*  Admin                                                                     */
/* -------------------------------------------------------------------------- */

export const ADMIN_NAV: NavLink[] = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Prodotti" },
  { href: "/admin/images", label: "Immagini" },
  { href: "/admin/gallery", label: "Galleria" },
  { href: "/admin/categories", label: "Categorie" },
  { href: "/admin/orders", label: "Ordini" },
  { href: "/admin/users", label: "Utenti" },
  { href: "/admin/settings", label: "Impostazioni" },
];

export const ORDER_STATUS_META: OrderStatusMeta[] = [
  {
    status: "pending",
    label: "In attesa",
    tone: "border-border text-muted",
  },
  {
    status: "processing",
    label: "In lavorazione",
    tone: "border-accent/40 text-accent",
  },
  {
    status: "shipped",
    label: "Spedito",
    tone: "border-sky-500/40 text-sky-600",
  },
  {
    status: "delivered",
    label: "Consegnato",
    tone: "border-emerald-500/40 text-emerald-600",
  },
  {
    status: "cancelled",
    label: "Annullato",
    tone: "border-danger/50 text-danger",
  },
];

export const DASHBOARD_METRICS: DashboardMetric[] = [
  {
    id: "revenue",
    label: "Ricavi (30gg)",
    value: "€ 48.240",
    deltaPct: 12.4,
    trend: "up",
    hint: "vs. 30 giorni precedenti",
  },
  {
    id: "orders",
    label: "Ordini",
    value: "612",
    deltaPct: 8.1,
    trend: "up",
    hint: "media 20,4 al giorno",
  },
  {
    id: "aov",
    label: "Scontrino medio",
    value: "€ 78,80",
    deltaPct: -2.3,
    trend: "down",
    hint: "effetto sconti quantità",
  },
  {
    id: "returns",
    label: "Resi",
    value: "1,9%",
    deltaPct: -0.4,
    trend: "up",
    hint: "sotto la soglia del 3%",
  },
];

/** Serie ricavi ultimi 12 periodi, per il grafico della dashboard. */
export const SALES_SERIES: SalesPoint[] = [
  { label: "Feb", revenueCents: 2810000, orders: 372 },
  { label: "Mar", revenueCents: 3120000, orders: 401 },
  { label: "Apr", revenueCents: 2990000, orders: 388 },
  { label: "Mag", revenueCents: 3540000, orders: 452 },
  { label: "Giu", revenueCents: 3860000, orders: 486 },
  { label: "Lug", revenueCents: 4824000, orders: 612 },
];
