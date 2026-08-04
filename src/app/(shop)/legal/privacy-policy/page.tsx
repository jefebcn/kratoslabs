import type { Metadata } from "next";
import { LegalScaffold, type LegalSectionData } from "@/components/legal/LegalScaffold";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Come KratosLabs tratta i dati personali, in linea con il GDPR.",
};

const SECTIONS: LegalSectionData[] = [
  {
    id: "titolare",
    title: "1. Titolare del trattamento",
    body: `Il titolare del trattamento dei dati è KratosLabs. Per qualsiasi richiesta relativa ai tuoi dati puoi scrivere a ${SITE.email} o contattarci tramite Telegram.`,
  },
  {
    id: "dati",
    title: "2. Dati raccolti",
    body: "Raccogliamo i dati che ci fornisci al momento dell'ordine: nome e cognome, email, indirizzo di spedizione (via, città, CAP, paese) ed eventuali note. Trattiamo inoltre i dati relativi ai tuoi ordini e alle comunicazioni con l'assistenza (email e Telegram) e dati tecnici di navigazione (indirizzo IP, tipo di dispositivo e browser) raccolti tramite cookie tecnici. Non trattiamo i dati completi delle carte di pagamento: il pagamento avviene tramite bonifico o criptovaluta e gli indirizzi crypto sono di sola ricezione.",
  },
  {
    id: "finalita",
    title: "3. Finalità e basi giuridiche",
    body: "Trattiamo i dati per: eseguire il contratto, cioè gestire l'ordine, il pagamento e la spedizione (art. 6.1.b GDPR); adempiere agli obblighi di legge, ad esempio contabili e fiscali (art. 6.1.c); perseguire il nostro legittimo interesse a garantire la sicurezza del sito e prevenire frodi (art. 6.1.f); inviare la newsletter, solo previo tuo consenso (art. 6.1.a), che puoi revocare in ogni momento.",
  },
  {
    id: "conservazione",
    title: "4. Periodo di conservazione",
    body: "Conserviamo i dati dell'ordine per il tempo necessario a evadere l'acquisto e a rispettare gli obblighi contabili e fiscali previsti dalla legge. I dati raccolti per la newsletter sono conservati fino alla revoca del consenso o alla cancellazione dalla lista. I dati tecnici di navigazione sono conservati per periodi limitati e proporzionati alle finalità di sicurezza.",
  },
  {
    id: "destinatari",
    title: "5. Comunicazione dei dati",
    body: "I dati possono essere comunicati ai corrieri e agli operatori logistici per la consegna, e ai fornitori tecnici che gestiscono l'hosting e l'infrastruttura del sito, che agiscono come responsabili del trattamento. Non vendiamo né cediamo i tuoi dati a terzi per finalità di marketing.",
  },
  {
    id: "diritti",
    title: "6. Diritti dell'interessato",
    body: `Puoi esercitare in ogni momento i diritti di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione previsti dagli articoli 15–22 del GDPR, oltre alla revoca del consenso. Per farlo scrivi a ${SITE.email}: rispondiamo nei tempi previsti dalla normativa. Hai inoltre il diritto di proporre reclamo all'autorità di controllo (in Italia, il Garante per la protezione dei dati personali).`,
  },
  {
    id: "cookie",
    title: "7. Cookie e tecnologie simili",
    body: "Il sito utilizza cookie tecnici necessari al funzionamento: gestione della sessione e del carrello, autenticazione e memorizzazione della lingua selezionata. Questi cookie non richiedono consenso. Al momento non utilizziamo cookie di profilazione pubblicitaria di terze parti; qualora venissero introdotti, ti verrà richiesto il consenso tramite apposito banner.",
  },
  {
    id: "sicurezza",
    title: "8. Sicurezza",
    body: "Adottiamo misure tecniche e organizzative adeguate per proteggere i dati: connessione cifrata (HTTPS), accesso limitato ai dati e nessuna conservazione di dati di pagamento sensibili. Gli indirizzi crypto sono utilizzati esclusivamente per ricevere i pagamenti.",
  },
  {
    id: "contatti",
    title: "9. Contatti",
    body: `Per esercitare i tuoi diritti o per domande su questa informativa scrivi a ${SITE.email}.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalScaffold
      title="Privacy policy"
      updated="Agosto 2026"
      intro="Questa informativa descrive come trattiamo i dati personali degli utenti del sito, in conformità al Regolamento (UE) 2016/679 (GDPR)."
      sections={SECTIONS}
    />
  );
}
