import { Icon } from "@/components/ui/icon";
import { PAYMENT_METHODS } from "@/lib/constants";

/** Banda "Accettiamo": metodi di pagamento, in stile competitor ma sui nostri. */
export function PaymentsBand() {
  return (
    <section className="border-y border-border bg-surface">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Accettiamo
        </span>
        <span className="hidden h-4 w-px bg-border sm:block" />
        <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {PAYMENT_METHODS.map((m) => (
            <span
              key={m.id}
              className="inline-flex items-center gap-1.5 text-sm text-text"
            >
              <Icon name={m.icon} className="size-4 text-accent" />
              {m.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
