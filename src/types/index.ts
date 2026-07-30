/**
 * Slug di categoria. Le categorie sono gestibili dall'admin e vivono nel
 * database, quindi lo slug è una stringa libera (non più un'unione fissa).
 */
export type CategorySlug = string;

export interface Category {
  slug: CategorySlug;
  name: string;
  description: string;
}

/** Specifiche tecniche mostrate nella tabella del PDP. */
export interface ProductSpecs {
  /** Peso netto della confezione in grammi. */
  netWeightG: number;
  /** Grammi per porzione. */
  servingSizeG: number;
  /** Numero di porzioni per confezione. */
  servingsPerContainer: number;
  /** Grammi di principio attivo per porzione (es. 25 g di proteine). */
  activePerServingG: number;
  /** Nome del principio attivo dichiarato in etichetta. */
  activeName: string;
  /** Confezione/formato (es. "10 fiale / 1 mL"). Opzionale. */
  packaging?: string;
}

export interface LabReport {
  lab: string;
  batch: string;
  /** ISO date. */
  testedOn: string;
  documentUrl: string;
}

export interface Product {
  id: string;
  slug: string;
  brand: string;
  title: string;
  shortDescription: string;
  description: string;
  category: CategorySlug;
  /** Prezzo di vendita in centesimi di euro. Mai float sui soldi. */
  priceCents: number;
  compareAtPriceCents?: number;
  /** Prezzo di acquisto (costo) in centesimi. Per il calcolo dei profitti. */
  costCents?: number;
  images: { url: string; alt: string }[];
  specs: ProductSpecs;
  labReport?: LabReport;
  stock: number;
  featured: boolean;
}

export interface CartLine {
  productId: string;
  slug: string;
  title: string;
  brand: string;
  imageUrl: string;
  unitPriceCents: number;
  quantity: number;
}

export interface BulkTier {
  minQuantity: number;
  /** 0.05 = 5% di sconto. */
  discount: number;
}

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Order {
  id: string;
  reference: string;
  customerEmail: string;
  status: OrderStatus;
  totalCents: number;
  lines: CartLine[];
  trackingId?: string;
  createdAt: string;
}

/* -------------------------------------------------------------------------- */
/*  Preferenze utente: valuta e lingua                                        */
/* -------------------------------------------------------------------------- */

export type CurrencyCode = "EUR" | "USD" | "GBP";

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  /** Locale usato da Intl.NumberFormat per questa valuta. */
  locale: string;
  /** Tasso di conversione dall'euro, solo per la visualizzazione. */
  rateFromEur: number;
}

export type LocaleCode = "it" | "en";

export interface LocaleMeta {
  code: LocaleCode;
  label: string;
  /** Etichetta breve mostrata nel toggle (es. "IT"). */
  short: string;
}

/* -------------------------------------------------------------------------- */
/*  Elementi presentazionali di homepage                                      */
/* -------------------------------------------------------------------------- */

/** `icon` è il nome di un'icona lucide-react risolta a runtime. */
export interface TrustBadge {
  icon: string;
  title: string;
  description: string;
}

export interface PaymentMethod {
  id: string;
  label: string;
  icon: string;
}

/** Foto dalla community: prova sociale, non decorazione. */
export interface GalleryItem {
  id: string;
  imageUrl: string;
  alt: string;
  author: string;
  location: string;
  /** Altezza relativa della tessera nel masonry (1 = base, 2 = doppia). */
  span: 1 | 2;
}

export interface NavLink {
  href: string;
  label: string;
}

/* -------------------------------------------------------------------------- */
/*  Admin: metriche e serie per la dashboard                                  */
/* -------------------------------------------------------------------------- */

export type Trend = "up" | "down" | "flat";

export interface DashboardMetric {
  id: string;
  label: string;
  /** Valore già formattato per il render (es. "€ 48.240"). */
  value: string;
  /** Variazione percentuale sul periodo precedente, es. +12.4. */
  deltaPct: number;
  trend: Trend;
  hint: string;
}

export interface SalesPoint {
  label: string;
  revenueCents: number;
  orders: number;
}

export interface OrderStatusMeta {
  status: OrderStatus;
  label: string;
  /** Classi Tailwind per il badge di stato. */
  tone: string;
}

/* -------------------------------------------------------------------------- */
/*  Recensioni dei clienti                                                    */
/* -------------------------------------------------------------------------- */

export interface Review {
  id: string;
  author: string;
  location: string;
  /** Voto da 1 a 5. */
  rating: number;
  title: string;
  body: string;
  /** Prodotto acquistato, per collegare la recensione al PDP. */
  productSlug: string;
  productTitle: string;
  /** ISO date. */
  date: string;
  /** True se la recensione arriva da un ordine reale sul sito. */
  verifiedPurchase: boolean;
}
