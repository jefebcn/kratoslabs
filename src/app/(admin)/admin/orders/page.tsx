import type { Metadata } from "next";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { MOCK_ORDERS } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Ordini" };

export default function AdminOrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Ordini</h1>
        <p className="num text-sm text-muted">{MOCK_ORDERS.length} ordini</p>
      </div>
      <OrdersTable orders={MOCK_ORDERS} />
    </div>
  );
}
