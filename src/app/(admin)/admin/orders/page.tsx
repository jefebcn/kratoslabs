import type { Metadata } from "next";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { listOrders } from "@/features/orders";
import { hasServiceRole } from "@/lib/supabase/admin";
import { isEmailConfigured } from "@/lib/email/resend";

export const metadata: Metadata = { title: "Ordini" };

export default async function AdminOrdersPage() {
  const orders = await listOrders();
  const unpaid = orders.filter((o) => o.paymentStatus === "unpaid").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Ordini</h1>
        <p className="num text-sm text-muted">
          {orders.length} ordini · {unpaid} da confermare
        </p>
      </div>

      {!hasServiceRole && (
        <p className="rounded-base border border-danger/40 bg-accent-soft px-4 py-3 text-sm text-danger">
          Stai vedendo ordini <strong>demo</strong>. Aggiungi{" "}
          <code>SUPABASE_SERVICE_ROLE_KEY</code> su Vercel per gestire quelli
          reali.
        </p>
      )}
      {hasServiceRole && !isEmailConfigured && (
        <p className="rounded-base border border-border bg-surface-2 px-4 py-3 text-sm text-muted">
          Le email di conferma non partono finché non configuri Resend
          (<code>RESEND_API_KEY</code> + <code>RESEND_FROM</code>). Lo stato
          dell&apos;ordine si aggiorna comunque.
        </p>
      )}

      <OrdersTable orders={orders} />
    </div>
  );
}
