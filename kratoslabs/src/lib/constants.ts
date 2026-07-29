import type { BulkTier, Category } from "@/types";

export const SITE = {
  name: "KratosLabs",
  tagline: "Integratori testati, dosaggi dichiarati.",
  email: "support@kratoslabs.example",
} as const;

/** Barra annuncio. Tre claim, tutti verificabili. */
export const ANNOUNCEMENTS = [
  "Analisi di terza parte su ogni lotto",
  "Spedizione tracciata in 24/48h",
  "Reso entro 30 giorni",
] as const;

export const CATEGORIES: Category[] = [
  {
    slug: "proteine",
    name: "Proteine",
    description: "Isolati e concentrati, profilo aminoacidico dichiarato.",
  },
  {
    slug: "creatina",
    name: "Creatina",
    description: "Monoidrato micronizzato, purezza certificata.",
  },
  {
    slug: "pre-workout",
    name: "Pre-workout",
    description: "Formule a dosaggio pieno, senza proprietary blend.",
  },
  {
    slug: "elettroliti",
    name: "Elettroliti",
    description: "Sodio, potassio e magnesio in rapporti misurati.",
  },
  {
    slug: "omega-3",
    name: "Omega-3",
    description: "EPA e DHA quantificati, test su metalli pesanti.",
  },
  {
    slug: "vitamine",
    name: "Vitamine",
    description: "Micronutrienti in forme biodisponibili.",
  },
];

/** Sconto quantità, applicato sulla singola riga di carrello. */
export const BULK_TIERS: BulkTier[] = [
  { minQuantity: 3, discount: 0.05 },
  { minQuantity: 5, discount: 0.1 },
  { minQuantity: 10, discount: 0.15 },
];

export const FREE_SHIPPING_THRESHOLD_CENTS = 5900;
export const SHIPPING_FLAT_CENTS = 590;

export const NAV_LINKS = [
  { href: "/guide", label: "Guide" },
  { href: "/recensioni", label: "Recensioni" },
  { href: "/analisi", label: "Analisi di laboratorio" },
] as const;

export const LEGAL_LINKS = [
  { href: "/legal/privacy-policy", label: "Privacy policy" },
  { href: "/legal/terms-of-service", label: "Termini di servizio" },
  { href: "/legal/shipping-and-returns", label: "Spedizioni e resi" },
] as const;
