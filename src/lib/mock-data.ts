import type { Order, Product, Review } from "@/types";

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
        url: "/images/products/tub.svg",
        alt: "Barattolo ISO Zero Whey Isolate su fondo antracite",
      },
      {
        url: "/images/products/box.svg",
        alt: "Confezione neutra di spedizione di ISO Zero",
      },
      {
        url: "/images/coa.svg",
        alt: "Referto di analisi del lotto KL-2601-A",
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
        url: "/images/products/jar.svg",
        alt: "Confezione di creatina monoidrato micronizzata",
      },
      {
        url: "/images/products/box.svg",
        alt: "Confezione neutra di spedizione della creatina",
      },
      {
        url: "/images/coa.svg",
        alt: "Referto di analisi del lotto KL-2558-C",
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
        url: "/images/products/shaker.svg",
        alt: "Barattolo Ignition pre-workout con shaker",
      },
      {
        url: "/images/products/box.svg",
        alt: "Confezione neutra di spedizione di Ignition",
      },
      {
        url: "/images/coa.svg",
        alt: "Referto di analisi del lotto KL-2604-B",
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
        url: "/images/products/sachets.svg",
        alt: "Bustine Hydrate elettroliti",
      },
      {
        url: "/images/products/box.svg",
        alt: "Confezione neutra di spedizione di Hydrate",
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
        url: "/images/products/softgels.svg",
        alt: "Flacone di omega-3 in capsule softgel",
      },
      {
        url: "/images/products/box.svg",
        alt: "Confezione neutra di spedizione di Omega-3",
      },
      {
        url: "/images/coa.svg",
        alt: "Referto di analisi del lotto KL-2571-A",
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
        imageUrl: "/images/products/tub.svg",
        unitPriceCents: 4490,
        quantity: 1,
      },
      {
        productId: "p_002",
        slug: "creatina-monoidrato-micronizzata",
        title: "Creatina Monoidrato Micronizzata",
        brand: "KratosLabs",
        imageUrl: "/images/products/jar.svg",
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
        imageUrl: "/images/products/shaker.svg",
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

/**
 * Recensioni dei clienti. Ognuna è legata a un prodotto reale del catalogo e
 * marcata come acquisto verificato. In produzione arrivano dal DB / da un
 * provider di recensioni, mantenendo la forma di `Review`.
 */
export const MOCK_REVIEWS: Review[] = [
  {
    id: "r_001",
    author: "Marco R.",
    location: "Milano",
    rating: 5,
    title: "Dosaggi reali, referto che combacia",
    body: "Ho confrontato l'etichetta con il referto del lotto: 27 g di proteine per porzione veri. Sapore neutro, si scioglie senza grumi. È il motivo per cui sono passato a KratosLabs.",
    productSlug: "iso-zero-whey-isolate",
    productTitle: "ISO Zero — Whey Isolate",
    date: "2026-07-22",
    verifiedPurchase: true,
  },
  {
    id: "r_002",
    author: "Sara T.",
    location: "Torino",
    rating: 5,
    title: "Creatina essenziale e pulita",
    body: "Nessun additivo, purezza dichiarata e certificata. 5 g esatti per misurino. Ordine arrivato in un giorno, imballo neutro come richiesto.",
    productSlug: "creatina-monoidrato-micronizzata",
    productTitle: "Creatina Monoidrato Micronizzata",
    date: "2026-07-20",
    verifiedPurchase: true,
  },
  {
    id: "r_003",
    author: "Luca B.",
    location: "Bologna",
    rating: 4,
    title: "Formula onesta, a etichetta aperta",
    body: "Finalmente un pre-workout senza proprietary blend: sai esattamente cosa prendi. Dosaggi pieni. Tolgo mezza stella solo perché vorrei più gusti disponibili.",
    productSlug: "ignition-pre-workout",
    productTitle: "Ignition — Pre-workout",
    date: "2026-07-18",
    verifiedPurchase: true,
  },
  {
    id: "r_004",
    author: "Giulia M.",
    location: "Roma",
    rating: 5,
    title: "Trasparenza totale sugli omega-3",
    body: "Test su mercurio, PCB e diossine pubblicati per il lotto. Forma trigliceride, nessun retrogusto. Ho comprato dopo aver letto il referto ed è tutto vero.",
    productSlug: "omega-3-triglyceride",
    productTitle: "Omega-3 forma trigliceride",
    date: "2026-07-15",
    verifiedPurchase: true,
  },
  {
    id: "r_005",
    author: "Davide P.",
    location: "Napoli",
    rating: 5,
    title: "Spedizione rapida e tracciata",
    body: "Ordinato di sera, consegnato dopo un giorno e mezzo con tracking sempre aggiornato. La creatina è micronizzata davvero, si scioglie in acqua senza residui.",
    productSlug: "creatina-monoidrato-micronizzata",
    productTitle: "Creatina Monoidrato Micronizzata",
    date: "2026-07-12",
    verifiedPurchase: true,
  },
  {
    id: "r_006",
    author: "Elena V.",
    location: "Firenze",
    rating: 5,
    title: "Il migliore isolato che abbia provato",
    body: "Digeribilità ottima, pochissimo lattosio come dichiarato. Il rapporto prezzo/grammo di proteine è migliore di marchi più blasonati. Riordino sicuro.",
    productSlug: "iso-zero-whey-isolate",
    productTitle: "ISO Zero — Whey Isolate",
    date: "2026-07-09",
    verifiedPurchase: true,
  },
  {
    id: "r_007",
    author: "Francesco L.",
    location: "Bari",
    rating: 4,
    title: "Elettroliti utili d'estate",
    body: "1000 mg di sodio per bustina, zero zuccheri: perfetti per le uscite lunghe in bici col caldo. Gusto leggero. Avrei gradito una confezione più grande.",
    productSlug: "hydrate-elettroliti",
    productTitle: "Hydrate — Elettroliti",
    date: "2026-07-05",
    verifiedPurchase: true,
  },
  {
    id: "r_008",
    author: "Chiara N.",
    location: "Verona",
    rating: 5,
    title: "Pre-workout che sento davvero",
    body: "Citrullina e beta-alanina a dosaggio pieno, la differenza sull'allenamento si sente. Niente crash dopo. La caffeina è quella dichiarata, non esagerata.",
    productSlug: "ignition-pre-workout",
    productTitle: "Ignition — Pre-workout",
    date: "2026-06-30",
    verifiedPurchase: true,
  },
  {
    id: "r_009",
    author: "Andrea S.",
    location: "Genova",
    rating: 5,
    title: "Acquisto affidabile, referti pubblici",
    body: "Quello che cercavo: poter verificare ogni lotto. Omega-3 in forma trigliceride, capsule non troppo grandi. Servizio clienti gentile via email.",
    productSlug: "omega-3-triglyceride",
    productTitle: "Omega-3 forma trigliceride",
    date: "2026-06-24",
    verifiedPurchase: true,
  },
];

export function getReviewsByProduct(slug: string) {
  return MOCK_REVIEWS.filter((r) => r.productSlug === slug);
}
