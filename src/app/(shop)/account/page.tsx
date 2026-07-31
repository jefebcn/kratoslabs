import { redirect } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getCurrentUser } from "@/lib/supabase/server";
import { isSupabaseConfigured, isAdminUser } from "@/lib/supabase/config";
import { signOut } from "@/features/auth/actions";
import { listOrdersForUser } from "@/features/orders";
import { AccountOrders } from "@/components/account/AccountOrders";
import { AccountRewards } from "@/components/account/AccountRewards";
import {
  getPointsBalance,
  getPointsHistory,
  grantOnceBonus,
} from "@/features/rewards";
import { BONUS_ACCOUNT } from "@/lib/rewards";

export const metadata: Metadata = {
  title: "Il mio account",
  robots: { index: false },
};

export default async function AccountPage() {
  if (!isSupabaseConfigured) redirect("/login");

  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const t = await getTranslations("account");
  const name = (user.user_metadata?.full_name as string | undefined) ?? null;
  const admin = isAdminUser(user);
  const orders = await listOrdersForUser(user.id, user.email ?? "");
  // Bonus benvenuto per la creazione dell'account (una tantum).
  await grantOnceBonus(user.id, "bonus_account", BONUS_ACCOUNT);
  const pointsBalance = await getPointsBalance(user.id);
  const pointsHistory = await getPointsHistory(user.id);

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <SectionHeading eyebrow={t("area")} title={t("title")} />

      <div className="mt-8 rounded-base border border-border bg-surface p-6">
        <dl className="grid gap-4 sm:grid-cols-2">
          {name && (
            <div>
              <dt className="text-xs uppercase tracking-wide text-muted">
                {t("name")}
              </dt>
              <dd className="mt-1 font-medium">{name}</dd>
            </div>
          )}
          <div>
            <dt className="text-xs uppercase tracking-wide text-muted">
              {t("email")}
            </dt>
            <dd className="mt-1 font-medium break-all">{user.email}</dd>
          </div>
        </dl>

        {admin && (
          <Link
            href="/admin"
            className="mt-6 inline-flex items-center gap-2 rounded-base border border-accent/30 bg-accent-soft px-3 py-2 text-sm font-semibold text-accent transition-colors hover:bg-accent hover:text-white"
          >
            <ShieldCheck className="size-4" aria-hidden />
            {t("adminDashboard")}
          </Link>
        )}
      </div>

      <section className="mt-10">
        <h2 className="text-lg font-semibold uppercase tracking-tight">
          {t("rewards.title")}
        </h2>
        <div className="mt-4">
          <AccountRewards balance={pointsBalance} history={pointsHistory} />
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold uppercase tracking-tight">
          {t("orders.title")}
        </h2>
        <AccountOrders orders={orders} />
      </section>

      <form action={signOut} className="mt-8">
        <Button type="submit" variant="outline" size="lg">
          {t("signOut")}
        </Button>
      </form>
    </div>
  );
}
