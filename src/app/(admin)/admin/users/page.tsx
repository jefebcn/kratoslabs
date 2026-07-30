import type { Metadata } from "next";
import { UsersTable } from "@/components/admin/UsersTable";
import { listUsers } from "@/features/users";
import { getCurrentUser } from "@/lib/supabase/server";
import { hasServiceRole } from "@/lib/supabase/admin";

export const metadata: Metadata = { title: "Utenti" };

export default async function AdminUsersPage() {
  const [users, current] = await Promise.all([listUsers(), getCurrentUser()]);
  const admins = users.filter((u) => u.isAdmin).length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Utenti</h1>
        <p className="text-sm text-muted">
          Chi ha creato un account. Promuovi ad admin, blocca o rimuovi gli
          accessi.
        </p>
      </div>

      {!hasServiceRole ? (
        <p className="rounded-base border border-danger/40 bg-accent-soft px-4 py-3 text-sm text-danger">
          Gestione non attiva: aggiungi <code>SUPABASE_SERVICE_ROLE_KEY</code> su
          Vercel e ridistribuisci.
        </p>
      ) : (
        <div className="flex flex-wrap gap-3 text-sm text-muted">
          <span className="rounded-base border border-border bg-surface px-3 py-1.5">
            <strong className="text-text">{users.length}</strong> utenti
          </span>
          <span className="rounded-base border border-border bg-surface px-3 py-1.5">
            <strong className="text-accent">{admins}</strong> admin
          </span>
        </div>
      )}

      <UsersTable users={users} currentUserId={current?.id} />
    </div>
  );
}
