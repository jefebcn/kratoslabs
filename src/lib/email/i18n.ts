import type { LocaleCode } from "@/types";

/**
 * Testi delle email ai clienti nelle lingue del sito. Le email per gli admin
 * restano in italiano (templates.ts).
 *
 * `**testo**` segna le parti in evidenza: in HTML diventano grassetto, nel
 * testo semplice si tolgono gli asterischi.
 */

export type PreConfirmationVariant = "new" | "resend" | "reminder" | "final";

interface VariantCopy {
  subject: (ref: string) => string;
  intro: string;
  preheader: (ref: string) => string;
}

export interface EmailStrings {
  /** Tag per Intl (prezzi) e per l'attributo lang dell'HTML. */
  intl: string;
  tagline: string;
  support: string;
  footnote: (site: string) => string;
  contactsHint: string;
  reference: string;
  paymentMethod: string;
  amountDue: string;
  methodBank: string;
  methodCrypto: string;
  timingBank: string;
  timingCrypto: string;
  preStatus: string;
  alreadyPaid: string;
  payIntro: string;
  holder: string;
  bank: string;
  causal: string;
  referenceHint: (ref: string) => string;
  variants: Record<PreConfirmationVariant, VariantCopy>;
  confirmed: {
    subject: (ref: string) => string;
    headline: string;
    textLine: (ref: string) => string;
    trackingSoon: string;
    preheader: (ref: string) => string;
  };
  shipped: {
    subject: (ref: string) => string;
    headline: string;
    textHeadline: string;
    trackingCode: string;
    delivery: string;
    trackButton: string;
    ordersButton: string;
    yourOrders: string;
    track: string;
    help: string;
    preheader: (ref: string) => string;
  };
}

const it: EmailStrings = {
  intl: "it-IT",
  tagline: "Integratori testati, dosaggi dichiarati.",
  support: "Assistenza",
  footnote: (site) => `Email transazionale relativa al tuo ordine su ${site}.`,
  contactsHint:
    "Per ricevere senza intoppi la conferma e il codice di tracciamento, aggiungi questo indirizzo ai tuoi contatti.",
  reference: "Riferimento ordine",
  paymentMethod: "Metodo di pagamento",
  amountDue: "Importo da pagare",
  methodBank: "bonifico bancario",
  methodCrypto: "criptovaluta",
  timingBank:
    "Alla ricezione del bonifico (di norma entro 24–48 ore) confermeremo l'ordine con una seconda email.",
  timingCrypto:
    "Appena verifichiamo il pagamento confermeremo l'ordine con una seconda email.",
  preStatus:
    "Questa è una **pre-conferma**: l'ordine non è ancora confermato.",
  alreadyPaid:
    "Se hai **già fatto il bonifico**, ignora questa email: confermeremo l'ordine appena il pagamento sarà accreditato (di norma 24–48 ore).",
  payIntro:
    "Esegui il bonifico con questi dati, indicando come causale il riferimento dell'ordine:",
  holder: "Intestatario",
  bank: "Banca",
  causal: "Causale",
  referenceHint: (ref) =>
    `Indica il riferimento **${ref}** nel pagamento, così possiamo abbinarlo al tuo ordine.`,
  variants: {
    new: {
      subject: (ref) => `Abbiamo ricevuto il tuo ordine ${ref}`,
      intro: "Grazie, abbiamo registrato il tuo ordine.",
      preheader: (ref) => `Ordine ${ref} ricevuto — pre-conferma`,
    },
    resend: {
      subject: (ref) => `Dati per il pagamento dell'ordine ${ref}`,
      intro: "Ti rimandiamo i dati per completare il pagamento del tuo ordine.",
      preheader: (ref) => `Ordine ${ref} — dati per il pagamento`,
    },
    reminder: {
      subject: (ref) => `Promemoria: completa il tuo ordine ${ref}`,
      intro:
        "Il tuo ordine è in attesa del pagamento: completa l'acquisto inviando il bonifico con i dati qui sotto.",
      preheader: (ref) => `Ordine ${ref} in attesa del bonifico`,
    },
    final: {
      subject: (ref) => `Ultimo promemoria per il tuo ordine ${ref}`,
      intro:
        "Non abbiamo ancora ricevuto il bonifico per il tuo ordine. Completa il pagamento con i dati qui sotto per non perdere l'ordine.",
      preheader: (ref) => `Ordine ${ref}: ultimo promemoria di pagamento`,
    },
  },
  confirmed: {
    subject: (ref) => `Ordine ${ref} confermato`,
    headline: "Pagamento ricevuto — ordine **confermato**.",
    textLine: (ref) => `Pagamento ricevuto: il tuo ordine ${ref} è confermato.`,
    trackingSoon:
      "Ti avviseremo con il codice di tracciamento appena la spedizione sarà in viaggio.",
    preheader: (ref) => `Ordine ${ref} confermato`,
  },
  shipped: {
    subject: (ref) => `Ordine ${ref} spedito`,
    headline: "Il tuo ordine è **in viaggio**. 🐺",
    textHeadline: "Il tuo ordine è in viaggio.",
    trackingCode: "Codice di tracciamento",
    delivery:
      "Consegna indicativa in **2–4 settimane**. Imballo neutro e anonimo, con tracciamento.",
    trackButton: "Traccia spedizione",
    ordersButton: "Vedi i tuoi ordini",
    yourOrders: "I tuoi ordini",
    track: "Traccia",
    help: "Se il tracciamento non si aggiorna o hai domande, rispondi a questa email o scrivici su Telegram.",
    preheader: (ref) => `Ordine ${ref} spedito`,
  },
};

const en: EmailStrings = {
  intl: "en-IE",
  tagline: "Tested supplements, declared dosages.",
  support: "Support",
  footnote: (site) => `Transactional email about your order on ${site}.`,
  contactsHint:
    "To make sure you receive the confirmation and tracking code, add this address to your contacts.",
  reference: "Order reference",
  paymentMethod: "Payment method",
  amountDue: "Amount due",
  methodBank: "bank transfer",
  methodCrypto: "cryptocurrency",
  timingBank:
    "Once we receive your transfer (usually within 24–48 hours), we'll confirm your order with a second email.",
  timingCrypto:
    "As soon as we verify your payment, we'll confirm your order with a second email.",
  preStatus: "This is a **pre-confirmation**: your order is not confirmed yet.",
  alreadyPaid:
    "If you have **already made the transfer**, please ignore this email: we'll confirm your order as soon as the payment arrives (usually within 24–48 hours).",
  payIntro:
    "Make the bank transfer with these details, using the order reference as the payment reference:",
  holder: "Account holder",
  bank: "Bank",
  causal: "Payment reference",
  referenceHint: (ref) =>
    `Include the reference **${ref}** with your payment so we can match it to your order.`,
  variants: {
    new: {
      subject: (ref) => `We've received your order ${ref}`,
      intro: "Thank you, we've received your order.",
      preheader: (ref) => `Order ${ref} received — pre-confirmation`,
    },
    resend: {
      subject: (ref) => `Payment details for order ${ref}`,
      intro: "Here are the details again to complete payment for your order.",
      preheader: (ref) => `Order ${ref} — payment details`,
    },
    reminder: {
      subject: (ref) => `Reminder: complete your order ${ref}`,
      intro:
        "Your order is awaiting payment: complete your purchase by sending the bank transfer with the details below.",
      preheader: (ref) => `Order ${ref} awaiting bank transfer`,
    },
    final: {
      subject: (ref) => `Final reminder for your order ${ref}`,
      intro:
        "We haven't received the bank transfer for your order yet. Complete the payment with the details below so you don't lose your order.",
      preheader: (ref) => `Order ${ref}: final payment reminder`,
    },
  },
  confirmed: {
    subject: (ref) => `Order ${ref} confirmed`,
    headline: "Payment received — order **confirmed**.",
    textLine: (ref) => `Payment received: your order ${ref} is confirmed.`,
    trackingSoon:
      "We'll send you the tracking code as soon as your parcel is on its way.",
    preheader: (ref) => `Order ${ref} confirmed`,
  },
  shipped: {
    subject: (ref) => `Order ${ref} shipped`,
    headline: "Your order is **on its way**. 🐺",
    textHeadline: "Your order is on its way.",
    trackingCode: "Tracking code",
    delivery:
      "Estimated delivery in **2–4 weeks**. Plain, discreet packaging with tracking.",
    trackButton: "Track shipment",
    ordersButton: "View your orders",
    yourOrders: "Your orders",
    track: "Track",
    help: "If the tracking doesn't update or you have any questions, reply to this email or message us on Telegram.",
    preheader: (ref) => `Order ${ref} shipped`,
  },
};

const de: EmailStrings = {
  intl: "de-DE",
  tagline: "Getestete Supplements, deklarierte Dosierungen.",
  support: "Support",
  footnote: (site) => `Transaktions-E-Mail zu deiner Bestellung bei ${site}.`,
  contactsHint:
    "Damit dich die Bestätigung und die Sendungsnummer sicher erreichen, füge diese Adresse zu deinen Kontakten hinzu.",
  reference: "Bestellnummer",
  paymentMethod: "Zahlungsart",
  amountDue: "Zu zahlender Betrag",
  methodBank: "Banküberweisung",
  methodCrypto: "Kryptowährung",
  timingBank:
    "Sobald deine Überweisung eingegangen ist (in der Regel innerhalb von 24–48 Stunden), bestätigen wir die Bestellung mit einer zweiten E-Mail.",
  timingCrypto:
    "Sobald wir die Zahlung geprüft haben, bestätigen wir die Bestellung mit einer zweiten E-Mail.",
  preStatus:
    "Dies ist eine **Vorbestätigung**: Die Bestellung ist noch nicht bestätigt.",
  alreadyPaid:
    "Wenn du die Überweisung **bereits getätigt hast**, ignoriere diese E-Mail: Wir bestätigen die Bestellung, sobald die Zahlung eingegangen ist (in der Regel innerhalb von 24–48 Stunden).",
  payIntro:
    "Überweise mit diesen Daten und gib die Bestellnummer als Verwendungszweck an:",
  holder: "Kontoinhaber",
  bank: "Bank",
  causal: "Verwendungszweck",
  referenceHint: (ref) =>
    `Gib die Nummer **${ref}** bei der Zahlung an, damit wir sie deiner Bestellung zuordnen können.`,
  variants: {
    new: {
      subject: (ref) => `Wir haben deine Bestellung ${ref} erhalten`,
      intro: "Danke, wir haben deine Bestellung erhalten.",
      preheader: (ref) => `Bestellung ${ref} erhalten — Vorbestätigung`,
    },
    resend: {
      subject: (ref) => `Zahlungsdaten für Bestellung ${ref}`,
      intro:
        "Hier sind noch einmal die Daten, um die Zahlung für deine Bestellung abzuschließen.",
      preheader: (ref) => `Bestellung ${ref} — Zahlungsdaten`,
    },
    reminder: {
      subject: (ref) => `Erinnerung: Schließe deine Bestellung ${ref} ab`,
      intro:
        "Deine Bestellung wartet auf die Zahlung: Schließe den Kauf ab, indem du die Überweisung mit den Daten unten tätigst.",
      preheader: (ref) => `Bestellung ${ref} wartet auf die Überweisung`,
    },
    final: {
      subject: (ref) => `Letzte Erinnerung zu deiner Bestellung ${ref}`,
      intro:
        "Wir haben die Überweisung für deine Bestellung noch nicht erhalten. Schließe die Zahlung mit den Daten unten ab, damit deine Bestellung nicht verfällt.",
      preheader: (ref) => `Bestellung ${ref}: letzte Zahlungserinnerung`,
    },
  },
  confirmed: {
    subject: (ref) => `Bestellung ${ref} bestätigt`,
    headline: "Zahlung erhalten — Bestellung **bestätigt**.",
    textLine: (ref) => `Zahlung erhalten: Deine Bestellung ${ref} ist bestätigt.`,
    trackingSoon:
      "Wir senden dir die Sendungsnummer, sobald dein Paket unterwegs ist.",
    preheader: (ref) => `Bestellung ${ref} bestätigt`,
  },
  shipped: {
    subject: (ref) => `Bestellung ${ref} versendet`,
    headline: "Deine Bestellung ist **unterwegs**. 🐺",
    textHeadline: "Deine Bestellung ist unterwegs.",
    trackingCode: "Sendungsnummer",
    delivery:
      "Voraussichtliche Lieferung in **2–4 Wochen**. Neutrale, diskrete Verpackung mit Sendungsverfolgung.",
    trackButton: "Sendung verfolgen",
    ordersButton: "Deine Bestellungen ansehen",
    yourOrders: "Deine Bestellungen",
    track: "Verfolgen",
    help: "Wenn sich die Sendungsverfolgung nicht aktualisiert oder du Fragen hast, antworte auf diese E-Mail oder schreib uns auf Telegram.",
    preheader: (ref) => `Bestellung ${ref} versendet`,
  },
};

const fr: EmailStrings = {
  intl: "fr-FR",
  tagline: "Compléments testés, dosages déclarés.",
  support: "Assistance",
  footnote: (site) => `E-mail transactionnel concernant votre commande sur ${site}.`,
  contactsHint:
    "Pour recevoir sans souci la confirmation et le numéro de suivi, ajoutez cette adresse à vos contacts.",
  reference: "Référence de commande",
  paymentMethod: "Mode de paiement",
  amountDue: "Montant à payer",
  methodBank: "virement bancaire",
  methodCrypto: "cryptomonnaie",
  timingBank:
    "Dès réception de votre virement (généralement sous 24 à 48 heures), nous confirmerons la commande par un second e-mail.",
  timingCrypto:
    "Dès que nous aurons vérifié le paiement, nous confirmerons la commande par un second e-mail.",
  preStatus:
    "Ceci est une **pré-confirmation** : la commande n'est pas encore confirmée.",
  alreadyPaid:
    "Si vous avez **déjà effectué le virement**, ignorez cet e-mail : nous confirmerons la commande dès réception du paiement (généralement sous 24 à 48 heures).",
  payIntro:
    "Effectuez le virement avec ces coordonnées, en indiquant la référence de commande comme motif :",
  holder: "Titulaire",
  bank: "Banque",
  causal: "Motif du virement",
  referenceHint: (ref) =>
    `Indiquez la référence **${ref}** lors du paiement afin que nous puissions l'associer à votre commande.`,
  variants: {
    new: {
      subject: (ref) => `Nous avons bien reçu votre commande ${ref}`,
      intro: "Merci, nous avons bien enregistré votre commande.",
      preheader: (ref) => `Commande ${ref} reçue — pré-confirmation`,
    },
    resend: {
      subject: (ref) => `Coordonnées de paiement de la commande ${ref}`,
      intro:
        "Voici à nouveau les coordonnées pour finaliser le paiement de votre commande.",
      preheader: (ref) => `Commande ${ref} — coordonnées de paiement`,
    },
    reminder: {
      subject: (ref) => `Rappel : finalisez votre commande ${ref}`,
      intro:
        "Votre commande est en attente de paiement : finalisez votre achat en effectuant le virement avec les coordonnées ci-dessous.",
      preheader: (ref) => `Commande ${ref} en attente du virement`,
    },
    final: {
      subject: (ref) => `Dernier rappel pour votre commande ${ref}`,
      intro:
        "Nous n'avons pas encore reçu le virement pour votre commande. Finalisez le paiement avec les coordonnées ci-dessous pour ne pas perdre votre commande.",
      preheader: (ref) => `Commande ${ref} : dernier rappel de paiement`,
    },
  },
  confirmed: {
    subject: (ref) => `Commande ${ref} confirmée`,
    headline: "Paiement reçu — commande **confirmée**.",
    textLine: (ref) => `Paiement reçu : votre commande ${ref} est confirmée.`,
    trackingSoon:
      "Nous vous enverrons le numéro de suivi dès que votre colis sera en route.",
    preheader: (ref) => `Commande ${ref} confirmée`,
  },
  shipped: {
    subject: (ref) => `Commande ${ref} expédiée`,
    headline: "Votre commande est **en route**. 🐺",
    textHeadline: "Votre commande est en route.",
    trackingCode: "Numéro de suivi",
    delivery:
      "Livraison estimée sous **2 à 4 semaines**. Emballage neutre et discret, avec suivi.",
    trackButton: "Suivre le colis",
    ordersButton: "Voir vos commandes",
    yourOrders: "Vos commandes",
    track: "Suivre",
    help: "Si le suivi ne se met pas à jour ou si vous avez des questions, répondez à cet e-mail ou écrivez-nous sur Telegram.",
    preheader: (ref) => `Commande ${ref} expédiée`,
  },
};

const pt: EmailStrings = {
  intl: "pt-PT",
  tagline: "Suplementos testados, dosagens declaradas.",
  support: "Apoio",
  footnote: (site) => `E-mail transacional sobre a tua encomenda na ${site}.`,
  contactsHint:
    "Para receberes sem problemas a confirmação e o código de rastreio, adiciona este endereço aos teus contactos.",
  reference: "Referência da encomenda",
  paymentMethod: "Método de pagamento",
  amountDue: "Valor a pagar",
  methodBank: "transferência bancária",
  methodCrypto: "criptomoeda",
  timingBank:
    "Assim que recebermos a transferência (normalmente em 24–48 horas), confirmaremos a encomenda com um segundo e-mail.",
  timingCrypto:
    "Assim que verificarmos o pagamento, confirmaremos a encomenda com um segundo e-mail.",
  preStatus:
    "Esta é uma **pré-confirmação**: a encomenda ainda não está confirmada.",
  alreadyPaid:
    "Se **já fizeste a transferência**, ignora este e-mail: confirmaremos a encomenda assim que o pagamento for creditado (normalmente em 24–48 horas).",
  payIntro:
    "Faz a transferência com estes dados, indicando a referência da encomenda como descritivo:",
  holder: "Titular",
  bank: "Banco",
  causal: "Descritivo",
  referenceHint: (ref) =>
    `Indica a referência **${ref}** no pagamento, para podermos associá-lo à tua encomenda.`,
  variants: {
    new: {
      subject: (ref) => `Recebemos a tua encomenda ${ref}`,
      intro: "Obrigado, registámos a tua encomenda.",
      preheader: (ref) => `Encomenda ${ref} recebida — pré-confirmação`,
    },
    resend: {
      subject: (ref) => `Dados de pagamento da encomenda ${ref}`,
      intro:
        "Voltamos a enviar-te os dados para concluíres o pagamento da tua encomenda.",
      preheader: (ref) => `Encomenda ${ref} — dados de pagamento`,
    },
    reminder: {
      subject: (ref) => `Lembrete: conclui a tua encomenda ${ref}`,
      intro:
        "A tua encomenda aguarda pagamento: conclui a compra fazendo a transferência com os dados abaixo.",
      preheader: (ref) => `Encomenda ${ref} a aguardar transferência`,
    },
    final: {
      subject: (ref) => `Último lembrete da tua encomenda ${ref}`,
      intro:
        "Ainda não recebemos a transferência da tua encomenda. Conclui o pagamento com os dados abaixo para não perderes a encomenda.",
      preheader: (ref) => `Encomenda ${ref}: último lembrete de pagamento`,
    },
  },
  confirmed: {
    subject: (ref) => `Encomenda ${ref} confirmada`,
    headline: "Pagamento recebido — encomenda **confirmada**.",
    textLine: (ref) => `Pagamento recebido: a tua encomenda ${ref} está confirmada.`,
    trackingSoon:
      "Enviaremos o código de rastreio assim que a encomenda estiver a caminho.",
    preheader: (ref) => `Encomenda ${ref} confirmada`,
  },
  shipped: {
    subject: (ref) => `Encomenda ${ref} enviada`,
    headline: "A tua encomenda está **a caminho**. 🐺",
    textHeadline: "A tua encomenda está a caminho.",
    trackingCode: "Código de rastreio",
    delivery:
      "Entrega estimada em **2–4 semanas**. Embalagem neutra e discreta, com rastreio.",
    trackButton: "Seguir envio",
    ordersButton: "Ver as tuas encomendas",
    yourOrders: "As tuas encomendas",
    track: "Seguir",
    help: "Se o rastreio não atualizar ou tiveres dúvidas, responde a este e-mail ou escreve-nos no Telegram.",
    preheader: (ref) => `Encomenda ${ref} enviada`,
  },
};

const STRINGS: Record<LocaleCode, EmailStrings> = { it, en, de, fr, pt };

/** Testi nella lingua indicata; italiano se la lingua manca o non è valida. */
export function emailStrings(locale?: string | null): EmailStrings {
  return STRINGS[(locale ?? "") as LocaleCode] ?? it;
}
