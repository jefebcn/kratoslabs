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
    body: "Il titolare del trattamento dei dati è KratosLabs. Per qualsiasi richiesta relativa ai tuoi dati puoi scrivere all'indirizzo indicato nella sezione contatti.",
    todo: [
      "Ragione sociale completa, indirizzo della sede legale e P.IVA",
      "Nominare un eventuale DPO e inserirne i contatti",
    ],
  },
  {
    id: "dati",
    title: "2. Dati raccolti",
    body: "Raccogliamo i dati che ci fornisci al momento dell'ordine (nome, email, indirizzo di spedizione) e dati tecnici di navigazione raccolti tramite cookie.",
    todo: [
      "Elenco esaustivo dei dati per categoria (identificativi, di pagamento, di navigazione)",
      "Distinzione tra dati obbligatori e facoltativi",
    ],
  },
  {
    id: "finalita",
    title: "3. Finalità e basi giuridiche",
    body: "Trattiamo i dati per eseguire il contratto (gestione dell'ordine e della spedizione), per adempimenti di legge (fatturazione) e, previo consenso, per finalità di marketing.",
    todo: [
      "Mappare ogni finalità alla relativa base giuridica (art. 6 GDPR)",
      "Definire la gestione del consenso per la newsletter",
    ],
  },
  {
    id: "conservazione",
    title: "4. Periodo di conservazione",
    todo: [
      "Tempi di conservazione per categoria di dati (ordini, fatture, marketing)",
      "Criteri di cancellazione o anonimizzazione",
    ],
  },
  {
    id: "diritti",
    title: "5. Diritti dell'interessato",
    body: "Puoi esercitare i diritti di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione previsti dagli articoli 15–22 del GDPR.",
    todo: [
      "Procedura e tempi di risposta alle richieste",
      "Riferimento all'autorità di controllo (Garante Privacy) per i reclami",
    ],
  },
  {
    id: "cookie",
    title: "6. Cookie e tecnologie simili",
    todo: [
      "Elenco dei cookie tecnici e di terze parti effettivamente usati",
      "Link alla cookie policy e al banner di consenso",
    ],
  },
  {
    id: "contatti",
    title: "7. Contatti",
    body: `Per esercitare i tuoi diritti o per domande su questa informativa scrivi a ${SITE.email}.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalScaffold
      title="Privacy policy"
      updated="Luglio 2026"
      intro="Questa informativa descrive come trattiamo i dati personali degli utenti del sito, in conformità al Regolamento (UE) 2016/679 (GDPR). Le sezioni marcate [Da compilare] vanno completate con l'assistenza di un legale prima della pubblicazione."
      sections={SECTIONS}
    />
  );
}
