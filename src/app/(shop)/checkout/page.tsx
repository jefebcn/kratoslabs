import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Truck } from "lucide-react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { getSiteSettings } from "@/features/settings";
import { buildCryptoAssets } from "@/lib/payments/crypto";
import { getCurrentUser } from "@/lib/supabase/server";
import { getPointsBalance } from "@/features/rewards";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default async function CheckoutPage() {
  const t = await getTranslations("checkout");
  const settings = await getSiteSettings();
  const payment = {
    bank: settings.bank,
    assets: buildCryptoAssets(settings.crypto),
  };
  const user = await getCurrentUser();
  const points = user ? await getPointsBalance(user.id) : 0;

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold uppercase tracking-tight">
        {t("title")}
      </h1>
      {settings.shipping.note && (
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-muted">
          <Truck className="size-4 text-accent" aria-hidden />
          {settings.shipping.note}
        </p>
      )}
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <CheckoutForm payment={payment} points={points} />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
