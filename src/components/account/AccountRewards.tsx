import { getTranslations } from "next-intl/server";
import { Gift } from "lucide-react";
import { formatPrice, cn } from "@/lib/utils";
import { pointsValueCents } from "@/lib/rewards";
import type { RewardEntry } from "@/features/rewards";

const KNOWN = new Set([
  "earn",
  "redeem",
  "refund",
  "reverse",
  "adjust",
  "bonus_account",
  "bonus_newsletter",
  "bonus_first_order",
]);

/** Card "Punti fedeltà": saldo, valore e storico movimenti. */
export async function AccountRewards({
  balance,
  history,
}: {
  balance: number;
  history: RewardEntry[];
}) {
  const t = await getTranslations("account.rewards");

  return (
    <div className="rounded-base border border-border bg-surface p-6">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-accent-soft text-accent">
          <Gift className="size-5" aria-hidden />
        </span>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted">
            {t("balance")}
          </p>
          <p className="text-xl font-semibold">
            <span className="num">{balance}</span> pt{" "}
            <span className="text-sm font-normal text-muted">
              {t("value", { value: formatPrice(pointsValueCents(balance)) })}
            </span>
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <p className="mt-4 text-sm text-muted">{t("empty")}</p>
      ) : (
        <ul className="mt-4 divide-y divide-border text-sm">
          {history.map((e) => {
            const reason = KNOWN.has(e.reason) ? e.reason : "adjust";
            const date = e.createdAt
              ? new Date(e.createdAt).toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "";
            return (
              <li key={e.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="truncate font-medium">{t(`reason.${reason}`)}</p>
                  <p className="text-xs text-muted">
                    {date}
                    {e.orderRef ? ` · ${t("order")} ${e.orderRef}` : ""}
                  </p>
                </div>
                <span
                  className={cn(
                    "num shrink-0 font-semibold",
                    e.delta >= 0 ? "text-emerald-600" : "text-muted",
                  )}
                >
                  {e.delta >= 0 ? "+" : ""}
                  {e.delta} pt
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
