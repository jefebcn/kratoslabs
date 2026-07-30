import Link from "next/link";
import type { Metadata } from "next";
import { StatCard } from "@/components/admin/StatCard";
import { SalesChart } from "@/components/admin/SalesChart";
import { RecentOrdersTable } from "@/components/admin/RecentOrdersTable";
import { listOrders, summarizeOrders, type AdminOrder } from "@/features/orders";
import { listProducts } from "@/features/products";
import { formatPrice } from "@/lib/utils";
import type { DashboardMetric, SalesPoint } from "@/types";

export const metadata: Metadata = { title: "Dashboard" };

const MONTHS_IT = [
  "Gen", "Feb", "Mar", "Apr", "Mag", "Giu",
  "Lug", "Ago", "Set", "Ott", "Nov", "Dic",
];

/** Aggrega i ricavi (ordini pagati) negli ultimi 6 mesi. */
function buildSeries(orders: AdminOrder[]): SalesPoint[] {
  const now = new Date();
  const buckets: SalesPoint[] = [];
  const index = new Map<string, number>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    index.set(`${d.getFullYear()}-${d.getMonth()}`, buckets.length);
    buckets.push({
      label: MONTHS_IT[d.getMonth()] ?? "",
      revenueCents: 0,
      orders: 0,
    });
  }
  for (const o of orders) {
    if (o.paymentStatus !== "paid" || !o.createdAt) continue;
    const d = new Date(o.createdAt);
    const idx = index.get(`${d.getFullYear()}-${d.getMonth()}`);
    if (idx === undefined) continue;
    const bucket = buckets[idx];
    if (!bucket) continue;
    bucket.revenueCents += o.totalCents;
    bucket.orders += 1;
  }
  return buckets;
}

export default async function AdminDashboardPage() {
  const [orders, products] = await Promise.all([listOrders(), listProducts()]);
  const stats = summarizeOrders(orders);
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const paidCount = orders.filter((o) => o.paymentStatus === "paid").length;

  const metrics: DashboardMetric[] = [
    {
      id: "revenue",
      label: "Ricavi (pagati)",
      value: formatPrice(stats.revenueCents),
      deltaPct: 0,
      trend: "flat",
      hint: `${paidCount} ${paidCount === 1 ? "ordine pagato" : "ordini pagati"}`,
    },
    {
      id: "orders",
      label: "Ordini totali",
      value: String(stats.ordersCount),
      deltaPct: 0,
      trend: "flat",
      hint: "dal lancio",
    },
    {
      id: "aov",
      label: "Scontrino medio",
      value: stats.avgOrderCents ? formatPrice(stats.avgOrderCents) : "—",
      deltaPct: 0,
      trend: "flat",
      hint: "su ordini pagati",
    },
    {
      id: "unpaid",
      label: "Da confermare",
      value: String(stats.unpaidCount),
      deltaPct: 0,
      trend: "flat",
      hint: "in attesa di pagamento",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted">Panoramica dello store in tempo reale.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((m) => (
          <StatCard key={m.id} metric={m} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <SalesChart data={buildSeries(orders)} />
        <div className="rounded-base border border-border bg-surface p-5">
          <h2 className="text-sm font-medium">Da evadere</h2>
          <dl className="mt-4 flex flex-col gap-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-muted">In lavorazione</dt>
              <dd className="num font-medium text-accent">{stats.processing}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Spediti (in transito)</dt>
              <dd className="num font-medium">{stats.shipped}</dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-muted">Prodotti esauriti</dt>
              <dd className="num font-medium text-danger">{outOfStock}</dd>
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
        {orders.length > 0 ? (
          <RecentOrdersTable orders={orders.slice(0, 8)} />
        ) : (
          <p className="rounded-base border border-border bg-surface px-4 py-8 text-center text-sm text-muted">
            Nessun ordine ancora.
          </p>
        )}
      </div>
    </div>
  );
}
