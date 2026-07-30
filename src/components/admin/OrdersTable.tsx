import { OrderControls } from "@/components/admin/OrderControls";
import { formatDate, formatPrice, cn } from "@/lib/utils";
import type { AdminOrder, PaymentStatus } from "@/features/orders/queries";

const PAYMENT_LABEL: Record<string, string> = {
  bank: "Bonifico",
  crypto: "Cripto",
  cards: "Carta",
  paypal: "PayPal",
};

const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; tone: string }
> = {
  unpaid: { label: "Da pagare", tone: "border-border text-muted" },
  paid: { label: "Pagato", tone: "border-emerald-500/40 text-emerald-600" },
  refunded: { label: "Rimborsato", tone: "border-sky-500/40 text-sky-600" },
  failed: { label: "Fallito", tone: "border-danger/50 text-danger" },
};

export function OrdersTable({ orders }: { orders: AdminOrder[] }) {
  if (orders.length === 0) {
    return (
      <p className="rounded-base border border-border bg-surface px-4 py-10 text-center text-sm text-muted">
        Nessun ordine ancora. I nuovi ordini dal checkout compaiono qui.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-base border border-border">
      <table className="w-full min-w-[860px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Ordine</th>
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 font-medium">Pagamento</th>
            <th className="px-4 py-3 text-right font-medium">Articoli</th>
            <th className="px-4 py-3 text-right font-medium">Totale</th>
            <th className="px-4 py-3 text-right font-medium">Data</th>
            <th className="px-4 py-3 font-medium">Stato / azioni</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const pay = PAYMENT_STATUS_META[o.paymentStatus];
            return (
              <tr
                key={o.id}
                className="border-b border-border align-top last:border-0"
              >
                <td className="num px-4 py-4 font-medium">{o.reference}</td>
                <td className="px-4 py-4 text-muted">{o.customerEmail}</td>
                <td className="px-4 py-4">
                  <div className="flex flex-col gap-1">
                    {o.paymentMethod && (
                      <span className="text-xs text-muted">
                        {PAYMENT_LABEL[o.paymentMethod] ?? o.paymentMethod}
                      </span>
                    )}
                    <span
                      className={cn(
                        "w-fit rounded-base border px-1.5 py-0.5 text-xs",
                        pay.tone,
                      )}
                    >
                      {pay.label}
                    </span>
                  </div>
                </td>
                <td className="num px-4 py-4 text-right">
                  {o.lines.reduce((n, l) => n + l.quantity, 0)}
                </td>
                <td className="num px-4 py-4 text-right">
                  {formatPrice(o.totalCents)}
                </td>
                <td className="num px-4 py-4 text-right text-muted">
                  {o.createdAt ? formatDate(o.createdAt) : "—"}
                </td>
                <td className="px-4 py-4">
                  <OrderControls
                    orderId={o.id}
                    status={o.status}
                    trackingId={o.trackingId}
                    paymentStatus={o.paymentStatus}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
