import type { Metadata } from "next";
import { LegalScaffold, type LegalSectionData } from "@/components/legal/LegalScaffold";

export const metadata: Metadata = {
  title: "Termini di servizio",
  description: "Condizioni generali di vendita e uso del sito KratosLabs.",
};

const SECTIONS: LegalSectionData[] = [
  {
    id: "oggetto",
    title: "1. Oggetto",
    body: "Questi termini regolano l'uso del sito e l'acquisto dei prodotti KratosLabs. Effettuando un ordine dichiari di averli letti e accettati.",
  },
  {
    id: "ordini",
    title: "2. Ordini e prezzi",
    body: "I prezzi sono indicati in euro, IVA inclusa dove applicabile. Un ordine si intende concluso al momento della conferma via email.",
    todo: [
      "Politica in caso di errori di prezzo o indisponibilità del prodotto",
      "Limiti di quantità per ordine, se previsti",
    ],
  },
  {
    id: "pagamenti",
    title: "3. Pagamenti",
    body: "Accettiamo carte, PayPal, bonifico e criptovalute. La transazione è gestita da provider terzi; non conserviamo i dati completi delle carte.",
    todo: ["Elenco dei provider di pagamento e relativi termini"],
  },
  {
    id: "spedizione",
    title: "4. Spedizione",
    body: "Le condizioni di spedizione, i tempi e i costi sono descritti nella pagina Spedizioni e resi, che è parte integrante di questi termini.",
  },
  {
    id: "recesso",
    title: "5. Diritto di recesso",
    body: "Il consumatore ha diritto di recedere entro 14 giorni secondo il Codice del Consumo, con le eccezioni di legge per i prodotti sigillati.",
    todo: [
      "Modalità di esercizio del recesso e modulo tipo",
      "Elenco delle eccezioni applicabili agli integratori sigillati",
    ],
  },
  {
    id: "garanzia",
    title: "6. Garanzia e conformità",
    todo: [
      "Riferimento alla garanzia legale di conformità (24 mesi)",
      "Procedura di reclamo per prodotti non conformi",
    ],
  },
  {
    id: "responsabilita",
    title: "7. Limitazione di responsabilità",
    todo: [
      "Clausole di limitazione nei limiti consentiti dalla legge",
      "Avvertenza: gli integratori non sostituiscono una dieta varia",
    ],
  },
  {
    id: "legge",
    title: "8. Legge applicabile e foro",
    todo: ["Legge applicabile e foro competente per i consumatori"],
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalScaffold
      title="Termini di servizio"
      updated="Luglio 2026"
      intro="Condizioni generali di vendita e d'uso. Le sezioni [Da compilare] richiedono la revisione di un legale prima della pubblicazione."
      sections={SECTIONS}
    />
  );
}
