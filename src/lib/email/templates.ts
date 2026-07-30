import { SITE } from "@/lib/constants";

const WRAP = (body: string) => `
<div style="font-family:Arial,Helvetica,sans-serif;max-width:520px;margin:0 auto;color:#15181d">
  <div style="background:#15181d;color:#fff;padding:16px 20px;border-radius:6px 6px 0 0">
    <strong style="font-size:18px;letter-spacing:.5px">KRATOS LABS</strong>
  </div>
  <div style="border:1px solid #e4e7ec;border-top:none;border-radius:0 0 6px 6px;padding:20px">
    ${body}
    <hr style="border:none;border-top:1px solid #e4e7ec;margin:20px 0" />
    <p style="font-size:12px;color:#5f6670;margin:0">${SITE.name} — ${SITE.tagline}</p>
  </div>
</div>`;

/** Email di pre-conferma inviata subito dopo la creazione dell'ordine. */
export function orderPreConfirmationEmail({
  reference,
  paymentMethod,
}: {
  reference: string;
  paymentMethod?: string;
}): { subject: string; html: string } {
  const isBank = paymentMethod === "bank";
  const method = isBank ? "bonifico bancario" : "criptovaluta";
  const timing = isBank
    ? "Alla ricezione del bonifico (di norma entro 24–48 ore) confermeremo l'ordine con una seconda email."
    : "Appena verifichiamo il pagamento confermeremo l'ordine con una seconda email.";

  const subject = `Abbiamo ricevuto il tuo ordine ${reference}`;
  const html = WRAP(`
    <p style="margin:0 0 12px">Grazie, abbiamo registrato il tuo ordine.</p>
    <p style="margin:0 0 12px">
      Riferimento: <strong>${reference}</strong><br/>
      Metodo di pagamento: <strong>${method}</strong>
    </p>
    <p style="margin:0 0 12px">
      Questa è una <strong>pre-conferma</strong>: l'ordine non è ancora
      confermato. ${timing}
    </p>
    <p style="margin:0;color:#5f6670;font-size:13px">
      Ricordati di indicare il riferimento <strong>${reference}</strong> nel
      pagamento, così possiamo abbinarlo al tuo ordine.
    </p>
  `);
  return { subject, html };
}

/** Email inviata dall'admin quando conferma la ricezione del pagamento. */
export function orderConfirmedEmail({
  reference,
}: {
  reference: string;
}): { subject: string; html: string } {
  const subject = `Ordine ${reference} confermato`;
  const html = WRAP(`
    <p style="margin:0 0 12px">Pagamento ricevuto: il tuo ordine è
      <strong style="color:#dc2626">confermato</strong>.</p>
    <p style="margin:0 0 12px">Riferimento: <strong>${reference}</strong></p>
    <p style="margin:0;color:#5f6670;font-size:13px">
      Ti avviseremo appena la spedizione sarà in viaggio.
    </p>
  `);
  return { subject, html };
}
