import type { Metadata } from "next";
import { LegalScaffold, type LegalSectionData } from "@/components/legal/LegalScaffold";

export const metadata: Metadata = {
  title: "Spedizioni e resi",
  description:
    "Tempi, costi, imballo neutro e politica di reso degli ordini KratosLabs.",
};

const SECTIONS: LegalSectionData[] = [
  {
    id: "politica",
    title: "1. Politica di consegna",
    body: "Facciamo il possibile per mantenere le tariffe di spedizione ragionevoli e per consegnare i tuoi articoli nel modo più efficiente e sicuro. Controlla con attenzione il tuo ordine prima del checkout: una volta inviato, non può essere modificato o annullato.",
  },
  {
    id: "tariffe",
    title: "2. Tariffe e tempi di spedizione",
    body: "Gli ordini vengono generalmente spediti entro 3 giorni lavorativi dopo la conferma del pagamento. Tariffe indicative: Unione Europea 22 € (consegna 12–16 giorni lavorativi); resto d'Europa 28 € (14–21 giorni); Stati Uniti 30 € (17–28 giorni). Le tariffe e i tempi possono variare in base a destinazione e periodo.",
    todo: [
      "Confermare/aggiornare tariffe e tempi definitivi per zona",
      "Eventuale soglia di spedizione gratuita",
    ],
  },
  {
    id: "imballo",
    title: "3. Imballo anonimo",
    body: "Spediamo in confezione neutra: scatola anonima, senza logo e senza indicazione del contenuto sull'esterno, per tutelare la tua privacy alla consegna. Il contenuto e la documentazione restano regolari e completi.",
  },
  {
    id: "tracciamento",
    title: "4. Tracciamento",
    body: "Ogni ordine viene spedito con tracciamento. Ricevi il codice via email non appena l'ordine viene affidato al corriere, con il link per seguire la spedizione dalla tua area account.",
  },
  {
    id: "ritardi",
    title: "5. Ritardi e segnalazioni",
    body: "Se il tracciamento non si aggiorna o il pacco risulta in ritardo, contatta l'assistenza. Le richieste inoltrate oltre 45 giorni dalla data di spedizione potrebbero non rientrare nella ri-spedizione o nella verifica.",
  },
  {
    id: "resi",
    title: "6. Resi",
    body: "Per motivi di sicurezza e integrità del prodotto, gli articoli venduti non sono restituibili una volta spediti.",
  },
  {
    id: "rimborsi",
    title: "7. Rimborsi",
    body: "Una volta effettuato il pagamento con uno qualsiasi dei metodi disponibili, non sono previsti rimborsi. Per problemi legati alla consegna fai riferimento alla sezione Ri-spedizione.",
  },
  {
    id: "sostituzioni",
    title: "8. Prodotti danneggiati o errati",
    body: "Se ricevi un prodotto danneggiato o diverso da quello ordinato, contattaci entro 48 ore dalla consegna allegando le foto: valutiamo la sostituzione dell'articolo.",
  },
  {
    id: "ri-spedizione",
    title: "9. Ri-spedizione",
    body: "In caso di problemi di consegna (es. pacco fermato in dogana), per richiedere una ri-spedizione fornisci: una foto ad almeno 120 dpi della busta/lettera della dogana con il nome del destinatario, una foto ad almeno 120 dpi dell'eventuale avviso di sequestro con il nome del destinatario e un nuovo indirizzo di spedizione. La ri-spedizione è prevista una sola volta per ordine.",
  },
  {
    id: "note",
    title: "10. Nota importante",
    body: "Pur impegnandoci a rispettare i tempi stimati, ritardi occasionali possono verificarsi per fattori fuori dal nostro controllo (dogana, corrieri, volumi elevati). Per qualsiasi problema con il pacco, contatta l'assistenza.",
  },
];

export default function ShippingAndReturnsPage() {
  return (
    <LegalScaffold
      title="Spedizioni, resi e ri-spedizione"
      updated="Agosto 2026"
      intro="Tariffe di spedizione, tempi di consegna, imballo anonimo, resi, rimborsi e procedura di ri-spedizione. Le voci [Da compilare] vanno confermate con i dati operativi definitivi."
      sections={SECTIONS}
    />
  );
}
