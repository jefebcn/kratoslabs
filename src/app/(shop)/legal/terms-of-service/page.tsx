import type { Metadata } from "next";
import { LegalScaffold, type LegalSectionData } from "@/components/legal/LegalScaffold";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Termini di servizio",
  description: "Condizioni generali di vendita e uso del sito KratosLabs.",
};

const SECTIONS: LegalSectionData[] = [
  {
    id: "oggetto",
    title: "1. Oggetto",
    body: "Questi termini regolano l'uso del sito e l'acquisto dei prodotti KratosLabs. Effettuando un ordine dichiari di averli letti e accettati integralmente. KratosLabs può aggiornare i termini in qualsiasi momento: si applica la versione in vigore al momento dell'ordine.",
  },
  {
    id: "ordini",
    title: "2. Ordini e prezzi",
    body: "I prezzi sono indicati in euro. Un ordine si intende concluso nel momento in cui ricevi la conferma via email con il relativo riferimento. Dopo l'invio, l'ordine non può essere modificato o annullato dal cliente. Ci riserviamo di non accettare o di annullare un ordine in caso di errore di prezzo manifesto, indisponibilità del prodotto o sospetto di uso fraudolento: in tal caso eventuali importi già versati per la parte non evasa vengono restituiti con lo stesso metodo di pagamento.",
  },
  {
    id: "pagamenti",
    title: "3. Pagamenti",
    body: `Accettiamo bonifico bancario (SEPA) e criptovalute (Bitcoin e USDT sulla rete TRON/TRC-20). Il pagamento con carta e PayPal non è al momento disponibile. Gli indirizzi crypto sono di sola ricezione e non conserviamo dati di pagamento sensibili. L'ordine viene confermato e preso in carico dopo la ricezione del pagamento; per i dettagli operativi consulta la Guida ai pagamenti o scrivi a ${SITE.email}.`,
  },
  {
    id: "spedizione",
    title: "4. Spedizione",
    body: "Le tariffe di spedizione seguono un modello a zone (Unione Europea, resto d'Europa, Stati Uniti) e sono indicate al checkout in base al paese di destinazione. Tempi, imballo neutro e condizioni sono descritti nella pagina Spedizioni e resi, che è parte integrante di questi termini.",
  },
  {
    id: "resi",
    title: "5. Resi, recesso e rimborsi",
    body: "Per motivi di sicurezza e integrità del prodotto, gli articoli sigillati non sono restituibili una volta spediti. Ai sensi dell'art. 59 del Codice del Consumo, il diritto di recesso non si applica alla fornitura di beni sigillati che non si prestano a essere restituiti per motivi di tutela della salute o di igiene, se aperti dopo la consegna. Salvo gli obblighi inderogabili di legge, una volta effettuato il pagamento non sono previsti rimborsi. In caso di problemi di consegna fai riferimento alla procedura di ri-spedizione descritta nella pagina Spedizioni e resi.",
  },
  {
    id: "garanzia",
    title: "6. Garanzia e prodotti danneggiati",
    body: "Ove applicabile, si applica la garanzia legale di conformità prevista dalla normativa a tutela del consumatore. Se ricevi un prodotto danneggiato o diverso da quello ordinato, contattaci entro 48 ore dalla consegna allegando le foto: valuteremo la sostituzione dell'articolo secondo quanto indicato nella pagina Spedizioni e resi.",
  },
  {
    id: "uso",
    title: "7. Uso dei prodotti e responsabilità",
    body: "I prodotti sono forniti esclusivamente a scopo di ricerca e valutazione analitica. Le informazioni presenti sul sito hanno natura descrittiva e non costituiscono consulenza medica né incoraggiamento all'uso. L'acquirente è l'unico responsabile del rispetto delle leggi e dei regolamenti vigenti nel proprio paese in materia di acquisto, importazione e detenzione. Nei limiti consentiti dalla legge, KratosLabs non risponde di danni derivanti da un uso improprio dei prodotti.",
  },
  {
    id: "proprieta",
    title: "8. Proprietà intellettuale",
    body: "I contenuti del sito (testi, grafica, logo, immagini e layout) sono di proprietà di KratosLabs o dei rispettivi titolari e non possono essere riprodotti senza autorizzazione.",
  },
  {
    id: "legge",
    title: "9. Legge applicabile e foro",
    body: "I presenti termini sono regolati dalla legge italiana. Per le controversie con i consumatori è competente il foro del luogo di residenza o domicilio del consumatore, se situato in Italia. Resta ferma la possibilità di ricorrere alla piattaforma europea di risoluzione delle controversie online (ODR).",
  },
  {
    id: "contatti",
    title: "10. Contatti",
    body: `Per qualsiasi domanda su questi termini scrivi a ${SITE.email} o contattaci tramite Telegram.`,
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalScaffold
      title="Termini di servizio"
      updated="Agosto 2026"
      intro="Condizioni generali di vendita e d'uso del sito KratosLabs. Ti invitiamo a leggerle prima di effettuare un ordine."
      sections={SECTIONS}
    />
  );
}
