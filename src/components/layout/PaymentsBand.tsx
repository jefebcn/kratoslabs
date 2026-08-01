import { useTranslations } from "next-intl";

/** Chip bianco che ritaglia lo spazio attorno al logo (immagini quadrate). */
function LogoChip({
  src,
  alt,
  wide = false,
}: {
  src: string;
  alt: string;
  wide?: boolean;
}) {
  return (
    <span
      className={`flex h-8 items-center justify-center overflow-hidden rounded-[6px] bg-white ${
        wide ? "w-36 px-1" : "w-9"
      }`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        className={`h-full w-full ${wide ? "object-cover" : "object-contain p-0.5"}`}
      />
    </span>
  );
}

/**
 * Banda scura con i metodi di pagamento accettati (loghi reali) e la
 * spedizione veloce.
 */
export function PaymentsBand() {
  const t = useTranslations("payments");

  return (
    <section className="mt-1.5 border-y border-black/10 bg-[#15181d] text-white lg:mt-2">
      <div className="mx-auto flex h-14 max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 px-4 sm:px-6">
        <span className="shrink-0 text-xs font-semibold uppercase tracking-[0.2em] text-white/55">
          {t("accept")}
        </span>
        <span className="hidden h-6 w-px shrink-0 bg-white/15 sm:block" />

        <div className="flex items-center gap-2">
          <LogoChip src="/images/pay/cards.jpg" alt="PayPal, Visa, Mastercard, American Express" wide />
          <LogoChip src="/images/pay/btc.jpg" alt="Bitcoin" />
          <LogoChip src="/images/pay/usdt.jpg" alt="Tether USDT" />
        </div>

        <span className="ml-auto inline-flex items-center gap-2 text-xs font-medium text-white/70">
          <LogoChip src="/images/pay/shipping.jpg" alt={t("fastShipping")} />
          {t("fastShipping")}
        </span>
      </div>
    </section>
  );
}
