import Link from "next/link";
import type { Metadata } from "next";
import { StatCard } from "@/components/admin/StatCard";
import { SalesChart } from "@/components/admin/SalesChart";
import { RecentOrdersTable } from "@/components/admin/RecentOrdersTable";
import { DASHBOARD_METRICS } from "@/lib/constants";
import { MOCK_ORDERS } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  const processing = MOCK_ORDERS.filter((o) => o.status === "processing").length;
  const shipped = MOCK_ORDERS.filter((o) => o.status === "shipped").length;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted">Panoramica degli ultimi 30 giorni.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {DASHBOARD_METRICS.map((m) => (
          <StatCard key={m.id} metric={m} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SalesChart />
        <div className="rounded-base border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Da evadere</h2>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">In lavorazione</dt>
              <dd className="num font-medium text-accent">{processing}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Spediti (in transito)</dt>
              <dd className="num font-medium">{shipped}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Prodotti esauriti</dt>
              <dd className="num font-medium text-danger">1</dd>
            </div>
          </dl>
          <Link
            href="/admin/orders"
            className="mt-5 inline-block text-sm text-accent hover:underline"
          >
            Gestisci gli ordini →
          </Link>
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-medium">Ordini recenti</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-accent hover:underline"
          >
            Tutti gli ordini
          </Link>
        </div>
        <RecentOrdersTable orders={MOCK_ORDERS} />
      </div>
    </div>
  );
}
