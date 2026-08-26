import { getTranslations } from "next-intl/server";
import { ExternalLink, Package, Truck } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { trackingUrl } from "@/lib/tracking";
import type { AdminOrder } from "@/features/orders";
import type { OrderStatus } from "@/types";

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: "border-amber-300 bg-amber-50 text-amber-700",
  processing: "border-blue-300 bg-blue-50 text-blue-700",
  shipped: "border-indigo-300 bg-indigo-50 text-indigo-700",
  delivered: "border-emerald-300 bg-emerald-50 text-emerald-700",
  cancelled: "border-rose-300 bg-rose-50 text-rose-700",
};

/** Elenco ordini del cliente con stato, totale e tracciamento. */
export async function AccountOrders({ orders }: { orders: AdminOrder[] }) {
  const t = await getTranslations("account.orders");

  if (orders.length === 0) {
    return (
      <div className="mt-4 rounded-base border border-dashed border-border bg-surface p-6 text-center text-sm text-muted">
        {t("empty")}
      </div>
    );
  }

  return (
    <ul className="mt-4 flex flex-col gap-4">
      {orders.map((o) => {
        const date = o.createdAt
          ? new Date(o.createdAt).toLocaleDateString("it-IT", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "";
        const count = o.lines.reduce((n, l) => n + l.quantity, 0);
        return (
          <li
            key={o.id}
            className="rounded-base border border-border bg-surface p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-semibold">{o.reference}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {t("date")}: {date}
                </p>
              </div>
              <span
                className={cn(
                  "rounded-full border px-2.5 py-1 text-xs font-semibold",
                  STATUS_STYLE[o.status],
                )}
              >
                {t(`status.${o.status}`)}
              </span>
            </div>

            <ul className="mt-4 flex flex-col gap-1.5 text-sm">
              {o.lines.map((l, i) => (
                <li
                  key={`${o.id}-${i}`}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="min-w-0 truncate text-text">
                    <span className="text-muted">{l.quantity}×</span> {l.title}
                  </span>
                  <span className="shrink-0 num text-muted">
                    {formatPrice(l.unitPriceCents * l.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
              <span className="text-xs text-muted">
                {t("items")}: {count}
              </span>
              <span className="text-sm font-semibold">
                {t("total")}: <span className="num">{formatPrice(o.totalCents)}</span>
              </span>
            </div>

            {(o.trackingId ||
              o.status === "pending" ||
              o.status === "processing") && (
              <div className="mt-3 flex items-center gap-2 rounded-base bg-surface-2 px-3 py-2 text-xs">
                {o.trackingId ? (
                  <>
                    <Truck className="size-4 text-accent" aria-hidden />
                    <span className="font-medium text-text">
                      {t("tracking")}:
                    </span>
                    <a
                      href={trackingUrl(o.trackingId)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-mono text-accent hover:underline"
                    >
                      {o.trackingId}
                      <ExternalLink className="size-3" aria-hidden />
                    </a>
                  </>
                ) : (
                  <>
                    <Package className="size-4 text-muted" aria-hidden />
                    <span className="text-muted">{t("trackingWaiting")}</span>
                  </>
                )}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
