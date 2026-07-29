import type { Order, Product } from "@/types";

/**
 * Dati di sviluppo. Sostituire con query al DB allo step 5,
 * mantenendo la stessa forma di `Product` così i componenti non cambiano.
 */
export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p_001",
    slug: "iso-zero-whey-isolate",
    brand: "KratosLabs",
    title: "ISO Zero — Whey Isolate",
    shortDescription: "27 g di proteine per porzione, 0,9 g di lattosio.",
    description:
      "Isolato di siero ottenuto per microfiltrazione a flusso incrociato. Profilo aminoacidico completo riportato in etichetta, senza aromi coprenti. Ogni lotto è analizzato per contenuto proteico reale e contaminanti.",
    category: "proteine",
    priceCents: 4490,
    compareAtPriceCents: 4990,
    images: [
      {
        url: "/images/placeholder-product.svg",
        alt: "Barattolo ISO Zero Whey Isolate su fondo antracite",
      },
    ],
    specs: {
      netWeightG: 900,
      servingSizeG: 30,
      servingsPerContainer: 30,
      activePerServingG: 27,
      activeName: "Proteine del siero isolate",
    },
    labReport: {
      lab: "Eurofins",
      batch: "KL-2601-A",
      testedOn: "2026-01-14",
      documentUrl: "/analisi/KL-2601-A.pdf",
    },
    stock: 84,
    featured: true,
  },
  {
    id: "p_002",
    slug: "creatina-monoidrato-micronizzata",
    brand: "KratosLabs",
    title: "Creatina Monoidrato Micronizzata",
    shortDescription: "5 g per porzione, purezza dichiarata 99,9%.",
    description:
      "Creatina monoidrato micronizzata, senza additivi né agenti antiagglomeranti. Dosaggio da 5 g, il valore su cui esiste la letteratura più solida.",
    category: "creatina",
    priceCents: 1990,
    images: [
      {
        url: "/images/placeholder-product.svg",
        alt: "Confezione di creatina monoidrato micronizzata",
      },
    ],
    specs: {
      netWeightG: 500,
      servingSizeG: 5,
      servingsPerContainer: 100,
      activePerServingG: 5,
      activeName: "Creatina monoidrato",
    },
    labReport: {
      lab: "Eurofins",
      batch: "KL-2558-C",
      testedOn: "2025-12-02",
      documentUrl: "/analisi/KL-2558-C.pdf",
    },
    stock: 210,
    featured: true,
  },
  {
    id: "p_003",
    slug: "ignition-pre-workout",
    brand: "KratosLabs",
    title: "Ignition — Pre-workout",
    shortDescription: "Caffeina 200 mg, citrullina 6 g, beta-alanina 3,2 g.",
    description:
      "Formula a etichetta aperta: ogni ingrediente è quantificato, nessun proprietary blend. Dosaggi allineati agli intervalli usati negli studi, non alle soglie minime.",
    category: "pre-workout",
    priceCents: 3290,
    images: [
      {
        url: "/images/placeholder-product.svg",
        alt: "Barattolo Ignition pre-workout",
      },
    ],
    specs: {
      netWeightG: 420,
      servingSizeG: 14,
      servingsPerContainer: 30,
      activePerServingG: 9.4,
      activeName: "Attivi totali quantificati",
    },
    labReport: {
      lab: "Eurofins",
      batch: "KL-2604-B",
      testedOn: "2026-02-08",
      documentUrl: "/analisi/KL-2604-B.pdf",
    },
    stock: 47,
    featured: true,
  },
  {
    id: "p_004",
    slug: "hydrate-elettroliti",
    brand: "KratosLabs",
    title: "Hydrate — Elettroliti",
    shortDescription: "1000 mg di sodio per bustina, zero zuccheri.",
    description:
      "Miscela di elettroliti per allenamenti lunghi o in ambiente caldo. Rapporto sodio-potassio-magnesio calibrato sulle perdite reali con il sudore.",
    category: "elettroliti",
    priceCents: 2490,
    images: [
      {
        url: "/images/placeholder-product.svg",
        alt: "Bustine Hydrate elettroliti",
      },
    ],
    specs: {
      netWeightG: 180,
      servingSizeG: 6,
      servingsPerContainer: 30,
      activePerServingG: 1.9,
      activeName: "Elettroliti totali",
    },
    stock: 0,
    featured: false,
  },
  {
    id: "p_005",
    slug: "omega-3-triglyceride",
    brand: "KratosLabs",
    title: "Omega-3 forma trigliceride",
    shortDescription: "EPA 660 mg, DHA 440 mg per dose da 2 capsule.",
    description:
      "Olio di pesce in forma trigliceride, più assorbibile dell'estere etilico. Test su mercurio, PCB e diossine su ogni lotto, con referto pubblicato.",
    category: "omega-3",
    priceCents: 2790,
    images: [
      {
        url: "/images/placeholder-product.svg",
        alt: "Flacone di omega-3 in capsule",
      },
    ],
    specs: {
      netWeightG: 120,
      servingSizeG: 2.4,
      servingsPerContainer: 60,
      activePerServingG: 1.1,
      activeName: "EPA + DHA",
    },
    labReport: {
      lab: "Eurofins",
      batch: "KL-2571-A",
      testedOn: "2025-12-19",
      documentUrl: "/analisi/KL-2571-A.pdf",
    },
    stock: 132,
    featured: false,
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: "o_001",
    reference: "KL-10241",
    customerEmail: "m.rossi@example.com",
    status: "processing",
    totalCents: 6480,
    lines: [
      {
        productId: "p_001",
        slug: "iso-zero-whey-isolate",
        title: "ISO Zero — Whey Isolate",
        brand: "KratosLabs",
        imageUrl: "/images/placeholder-product.svg",
        unitPriceCents: 4490,
        quantity: 1,
      },
      {
        productId: "p_002",
        slug: "creatina-monoidrato-micronizzata",
        title: "Creatina Monoidrato Micronizzata",
        brand: "KratosLabs",
        imageUrl: "/images/placeholder-product.svg",
        unitPriceCents: 1990,
        quantity: 1,
      },
    ],
    createdAt: "2026-07-28T09:14:00.000Z",
  },
  {
    id: "o_002",
    reference: "KL-10240",
    customerEmail: "g.bianchi@example.com",
    status: "shipped",
    totalCents: 3290,
    lines: [
      {
        productId: "p_003",
        slug: "ignition-pre-workout",
        title: "Ignition — Pre-workout",
        brand: "KratosLabs",
        imageUrl: "/images/placeholder-product.svg",
        unitPriceCents: 3290,
        quantity: 1,
      },
    ],
    trackingId: "IT884120993",
    createdAt: "2026-07-27T16:02:00.000Z",
  },
];

export function getProductBySlug(slug: string) {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}

export function getProductsByCategory(category: string) {
  return MOCK_PRODUCTS.filter((p) => p.category === category);
}

export function getFeaturedProducts() {
  return MOCK_PRODUCTS.filter((p) => p.featured);
}
