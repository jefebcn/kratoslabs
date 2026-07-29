import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export function OrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-x-auto rounded-base border border-border">
      <table className="w-full min-w-[760px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Ordine</th>
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 text-right font-medium">Articoli</th>
            <th className="px-4 py-3 text-right font-medium">Totale</th>
            <th className="px-4 py-3 text-right font-medium">Data</th>
            <th className="px-4 py-3 font-medium">Stato</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-border align-top last:border-0">
              <td className="num px-4 py-4 font-medium">{o.reference}</td>
              <td className="px-4 py-4 text-muted">{o.customerEmail}</td>
              <td className="num px-4 py-4 text-right">
                {o.lines.reduce((n, l) => n + l.quantity, 0)}
              </td>
              <td className="num px-4 py-4 text-right">
                {formatPrice(o.totalCents)}
              </td>
              <td className="num px-4 py-4 text-right text-muted">
                {formatDate(o.createdAt)}
              </td>
              <td className="px-4 py-4">
                <OrderStatusSelect initial={o.status} trackingId={o.trackingId} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
