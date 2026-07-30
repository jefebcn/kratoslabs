import type { Metadata } from "next";
import { LegalScaffold, type LegalSectionData } from "@/components/legal/LegalScaffold";

export const metadata: Metadata = {
  title: "Spedizioni e resi",
  description:
    "Tempi, costi, imballo neutro e politica di reso degli ordini KratosLabs.",
};

const SECTIONS: LegalSectionData[] = [
  {
    id: "tempi",
    title: "1. Tempi e costi",
    body: "Spediamo con corriere tracciato. La consegna è tipicamente in 24/48h dopo la lavorazione dell'ordine. La spedizione è gratuita sopra la soglia indicata al checkout, altrimenti si applica una tariffa fissa.",
    todo: [
      "Tabella tempi e costi per zona / paese",
      "Orario limite (cut-off) per la lavorazione in giornata",
    ],
  },
  {
    id: "imballo",
    title: "2. Imballo neutro",
    body: "Su richiesta spediamo in confezione neutra: scatola anonima, senza logo e senza indicazione del contenuto sull'esterno, per tutelare la tua privacy alla consegna. Il contenuto e la documentazione restano regolari e completi.",
  },
  {
    id: "paesi",
    title: "3. Paesi serviti",
    todo: [
      "Elenco dei paesi in cui spediamo",
      "Eventuali vincoli doganali o note per le spedizioni internazionali",
    ],
  },
  {
    id: "tracciamento",
    title: "4. Tracciamento",
    body: "Ricevi il codice di tracciamento via email non appena l'ordine viene affidato al corriere, con il link per seguire la spedizione.",
  },
  {
    id: "resi",
    title: "5. Resi e rimborsi",
    body: "Puoi rendere i prodotti integri e sigillati entro 30 giorni. A ricezione e verifica, il rimborso viene emesso sullo stesso metodo di pagamento usato per l'ordine.",
    todo: [
      "Chi sostiene i costi del reso e modalità di spedizione del reso",
      "Tempi di accredito del rimborso per metodo di pagamento",
    ],
  },
  {
    id: "danni",
    title: "6. Prodotti danneggiati o errati",
    body: "Se ricevi un prodotto danneggiato o diverso da quello ordinato, contattaci entro 48 ore dalla consegna allegando le foto: organizziamo la sostituzione senza costi.",
  },
];

export default function ShippingAndReturnsPage() {
  return (
    <LegalScaffold
      title="Spedizioni e resi"
      updated="Luglio 2026"
      intro="Come spediamo e come gestiamo resi e rimborsi. Le sezioni [Da compilare] vanno completate con i dati operativi definitivi (corrieri, zone, tempi)."
      sections={SECTIONS}
    />
  );
}
