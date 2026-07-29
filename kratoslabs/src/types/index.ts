export type CategorySlug =
  | "proteine"
  | "creatina"
  | "pre-workout"
  | "elettroliti"
  | "omega-3"
  | "vitamine";

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
  /** Prezzo in centesimi di euro. Mai float sui soldi. */
  priceCents: number;
  compareAtPriceCents?: number;
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
