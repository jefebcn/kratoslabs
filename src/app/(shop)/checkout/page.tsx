import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-semibold uppercase tracking-tight">Checkout</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <CheckoutForm />
        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
