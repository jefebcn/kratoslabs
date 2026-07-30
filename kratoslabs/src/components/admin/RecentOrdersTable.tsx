import Link from "next/link";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order } from "@/types";

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return (
    <div className="overflow-x-auto rounded-base border border-border">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Ordine</th>
            <th className="px-4 py-3 font-medium">Cliente</th>
            <th className="px-4 py-3 font-medium">Stato</th>
            <th className="px-4 py-3 text-right font-medium">Totale</th>
            <th className="px-4 py-3 text-right font-medium">Data</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr
              key={o.id}
              className="border-b border-border last:border-0 hover:bg-surface-2/50"
            >
              <td className="px-4 py-3">
                <Link
                  href="/admin/orders"
                  className="num font-medium hover:text-accent"
                >
                  {o.reference}
                </Link>
              </td>
              <td className="px-4 py-3 text-muted">{o.customerEmail}</td>
              <td className="px-4 py-3">
                <StatusBadge status={o.status} />
              </td>
              <td className="num px-4 py-3 text-right">
                {formatPrice(o.totalCents)}
              </td>
              <td className="num px-4 py-3 text-right text-muted">
                {formatDate(o.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
