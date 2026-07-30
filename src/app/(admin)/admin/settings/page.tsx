import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSiteSettings } from "@/features/settings";
import { hasServiceRole } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Impostazioni" };

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Impostazioni</h1>
        <p className="text-sm text-muted">
          Annunci, coordinate di pagamento e spedizione. Le modifiche vanno
          subito online.
        </p>
      </div>

      {!hasServiceRole && (
        <p className="rounded-base border border-danger/40 bg-accent-soft px-4 py-3 text-sm text-danger">
          Salvataggio non attivo: aggiungi <code>SUPABASE_SERVICE_ROLE_KEY</code>{" "}
          su Vercel e ridistribuisci.
        </p>
      )}

      <SettingsForm settings={settings} />
    </div>
  );
}
