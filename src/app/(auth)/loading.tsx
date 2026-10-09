import { Loader2 } from "lucide-react";

/**
 * Mostrato appena si tocca "Accedi" o "Registrati", mentre la pagina arriva
 * dal server: senza, su connessioni lente il tocco sembra non fare nulla.
 */
export default function AuthLoading() {
  return (
    <div className="flex justify-center py-10" role="status" aria-live="polite">
      <Loader2 className="size-6 animate-spin text-accent" aria-hidden />
      <span className="sr-only">Caricamento…</span>
    </div>
  );
}
