/**
 * Genera descrizione e specifiche per i prodotti Deus Medical a partire dal
 * principio attivo e dalla categoria. Contenuti FATTUALI e neutri (identità,
 * classe farmacologica, forma, confezione): nessun dosaggio, protocollo o
 * claim di efficacia. Ogni scheda riporta il disclaimer "solo ricerca".
 */

export interface EnrichInput {
  title: string;
  category: string;
  activeName: string;
  packaging?: string;
}

export interface EnrichedSpecs {
  activeName: string;
  packaging: string;
  productClass: string;
  form: string;
  concentration: string;
  manufacturer: string;
}

interface ClassInfo {
  /** Etichetta breve per la tabella specifiche. */
  label: string;
  /** Frase per la descrizione (termina senza punto). */
  clause: string;
}

/** Regole di classificazione per principio attivo (prima corrispondenza vince). */
const RULES: { re: RegExp; info: (inj: boolean) => ClassInfo }[] = [
  {
    re: /anastrozol|letrozol|exemestan|aromasin|arimidex|femara/i,
    info: () => ({
      label: "Inibitore dell'aromatasi",
      clause:
        "è un inibitore dell'aromatasi, impiegato per il controllo dei livelli di estradiolo",
    }),
  },
  {
    re: /tamoxifen|clomif|clomiphen|toremifen|raloxifen|nolvadex/i,
    info: () => ({
      label: "SERM (anti-estrogeno)",
      clause: "è un modulatore selettivo del recettore degli estrogeni (SERM)",
    }),
  },
  {
    re: /chorionic|hcg|gonadotropin/i,
    info: () => ({
      label: "Gonadotropina corionica (hCG)",
      clause: "è gonadotropina corionica umana (hCG)",
    }),
  },
  {
    re: /cabergolin|dostinex/i,
    info: () => ({
      label: "Agonista dopaminergico",
      clause: "è un agonista dei recettori della dopamina",
    }),
  },
  {
    re: /clenbuterol/i,
    info: () => ({
      label: "Agonista beta-2 (termogenico)",
      clause: "è un agonista beta-2 adrenergico ad azione termogenica",
    }),
  },
  {
    re: /liothyronin|triiodothyron|\bt3\b|levothyroxin|thyroxin|\bt4\b/i,
    info: () => ({
      label: "Ormone tiroideo",
      clause: "è un ormone tiroideo sintetico",
    }),
  },
  {
    re: /semaglutid|tirzepatid|liraglutid|retatrutid/i,
    info: () => ({
      label: "Agonista GLP-1",
      clause: "è un agonista del recettore del GLP-1",
    }),
  },
  {
    re: /tadalafil|sildenafil|vardenafil/i,
    info: () => ({
      label: "Inibitore PDE5",
      clause:
        "è un inibitore della PDE5, per il supporto della funzione sessuale",
    }),
  },
  {
    re: /somatropin|growth hormone|\bhgh\b|\bgh\b/i,
    info: () => ({
      label: "Ormone della crescita (somatropina)",
      clause: "è somatropina, ormone della crescita umano ricombinante",
    }),
  },
  {
    re: /ibutamoren|mk-?677|mk 677/i,
    info: () => ({
      label: "Secretagogo GH",
      clause: "è un secretagogo dell'ormone della crescita",
    }),
  },
  {
    re: /cardarine|gw-?501516|gw 501516/i,
    info: () => ({
      label: "Agonista PPARδ",
      clause: "è un agonista del recettore PPARδ",
    }),
  },
  {
    re: /ostarine|mk-?2866|ligandrol|lgd-?4033|testolone|rad-?140|andarine|\bs-?4\b|yk-?11|stenabolic|sr-?9009|sarm/i,
    info: () => ({
      label: "SARM",
      clause:
        "è un modulatore selettivo del recettore degli androgeni (SARM)",
    }),
  },
  {
    re: /peptide|ipamorelin|cjc|tesamorelin|ghrp|bpc|tb-?500|melanotan|pt-?141/i,
    info: () => ({
      label: "Peptide",
      clause: "è un peptide di sintesi",
    }),
  },
  {
    // Tutti gli steroidi anabolizzanti (testosterone, nandrolone, trenbolone,
    // drostanolone, boldenone, methandienone, oxandrolone, stanozolol, ecc.)
    re: /testosteron|nandrolon|trenbolon|drostanolon|boldenon|methandien|methandrostenolon|methenolon|oxandrolon|stanozolol|oxymetholon|mesterolon|fluoxymesteron|dihydroboldenon|\bdhb\b|dianabol|sustanon/i,
    info: (inj) => ({
      label: "Steroide androgeno-anabolizzante",
      clause: inj
        ? "appartiene alla classe degli steroidi androgeno-anabolizzanti, in soluzione oleosa per uso intramuscolare"
        : "è uno steroide androgeno-anabolizzante in forma orale",
    }),
  },
];

const CATEGORY_LABEL: Record<string, string> = {
  iniettabili: "Steroide iniettabile",
  orali: "Steroide orale",
  "post-cycle": "Terapia post-ciclo (PCT)",
  "brucia-grassi": "Termogenico / metabolico",
  "sex-support": "Supporto sessuale",
  "hgh-peptidi": "HGH / Peptide",
  sarms: "SARM",
  salute: "Supporto / salute",
};

/** Forma dal testo confezione + categoria. */
function detectForm(packaging: string, category: string): {
  form: string;
  injectable: boolean;
} {
  const p = packaging.toLowerCase();
  if (/penna|\bpen\b/.test(p)) return { form: "Penna preriempita", injectable: true };
  if (/fial|iniett|sterile|i\.m|soluzione|\/\s*1?\s*ml|mg\/ml/.test(p) || category === "iniettabili")
    return { form: "Soluzione iniettabile", injectable: true };
  if (/flacon|vial|liofil/.test(p))
    return { form: "Flaconcino", injectable: true };
  if (/compress|blister|tab|orale|capsul/.test(p) || category === "orali" || category === "sarms")
    return { form: "Compresse (uso orale)", injectable: false };
  return { form: packaging || "—", injectable: category === "iniettabili" };
}

/** Estrae la concentrazione (es. "250mg/ml", "1mg/tab", "40mcg/tab"). */
function detectConcentration(activeName: string): string {
  const m = activeName.match(
    /(\d+(?:[.,]\d+)?)\s*(mg|mcg|µg|iu|ui)\s*\/\s*(ml|tab|compressa|cap|pen|die)/i,
  );
  if (m && m[1] && m[2] && m[3])
    return `${m[1]} ${m[2].toLowerCase()}/${m[3].toLowerCase()}`;
  const m2 = activeName.match(/(\d+(?:[.,]\d+)?)\s*(mg|mcg|iu|ui)\b/i);
  return m2 && m2[1] && m2[2] ? `${m2[1]} ${m2[2].toLowerCase()}` : "";
}

function classify(activeName: string, injectable: boolean): ClassInfo | null {
  for (const rule of RULES) {
    if (rule.re.test(activeName)) return rule.info(injectable);
  }
  return null;
}

/** Descrizione + specifiche arricchite per un prodotto. */
export function enrichDeus(p: EnrichInput): {
  description: string;
  specs: EnrichedSpecs;
} {
  const packaging = p.packaging || "";
  const { form, injectable } = detectForm(packaging, p.category);
  const concentration = detectConcentration(p.activeName);
  const info = classify(p.activeName, injectable);
  const productClass =
    info?.label ?? CATEGORY_LABEL[p.category] ?? "Prodotto Deus Medical";

  const parts: string[] = [
    `${p.title} di Deus Medical contiene ${p.activeName}.`,
  ];
  if (info) parts.push(`${capitalize(info.clause)}.`);
  if (packaging) parts.push(`Confezione: ${packaging.replace(/\.\s*$/, "")}.`);
  parts.push(
    "La qualità di ogni lotto è verificabile nella sezione Lab test / QC.",
  );
  parts.push(
    "Conservare al riparo da luce e calore, fuori dalla portata dei bambini.",
  );
  parts.push(
    "Prodotto fornito esclusivamente a scopo di ricerca e valutazione analitica, non presentato come trattamento medico.",
  );

  return {
    description: parts.join(" "),
    specs: {
      activeName: p.activeName,
      packaging,
      productClass,
      form,
      concentration,
      manufacturer: "Deus Medical",
    },
  };
}

function capitalize(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}
