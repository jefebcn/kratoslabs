"use client";

import { ShieldCheck, ShieldOff, Ban, CircleCheck, Trash2 } from "lucide-react";
import { setUserRole, setUserBan, deleteUser } from "@/features/users/actions";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { AdminUser } from "@/features/users/queries";

function IconButton({
  action,
  hidden,
  children,
  tone = "muted",
  confirm,
}: {
  action: (formData: FormData) => void | Promise<void>;
  hidden: Record<string, string>;
  children: React.ReactNode;
  tone?: "muted" | "danger" | "accent";
  confirm?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (confirm && !window.confirm(confirm)) e.preventDefault();
      }}
    >
      {Object.entries(hidden).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <button
        type="submit"
        className={cn(
          "inline-flex items-center gap-1 whitespace-nowrap text-xs transition-colors",
          tone === "danger" && "text-muted hover:text-danger",
          tone === "accent" && "text-muted hover:text-accent",
          tone === "muted" && "text-muted hover:text-text",
        )}
      >
        {children}
      </button>
    </form>
  );
}

export function UsersTable({
  users,
  currentUserId,
}: {
  users: AdminUser[];
  currentUserId?: string;
}) {
  if (users.length === 0) {
    return (
      <p className="rounded-base border border-border bg-surface px-4 py-8 text-center text-sm text-muted">
        Nessun utente registrato al momento.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-base border border-border">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
            <th className="px-4 py-3 font-medium">Utente</th>
            <th className="px-4 py-3 font-medium">Registrato</th>
            <th className="px-4 py-3 font-medium">Ultimo accesso</th>
            <th className="px-4 py-3 font-medium">Stato</th>
            <th className="px-4 py-3 text-right font-medium">Azioni</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const self = u.id === currentUserId;
            return (
              <tr key={u.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{u.email}</span>
                    {self && (
                      <span className="rounded-base border border-border px-1.5 py-0.5 text-[10px] uppercase text-muted">
                        Tu
                      </span>
                    )}
                  </div>
                  {!u.emailConfirmed && (
                    <span className="text-xs text-amber-600">
                      Email non confermata
                    </span>
                  )}
                </td>
                <td className="num px-4 py-3 text-muted">
                  {formatDate(u.createdAt)}
                </td>
                <td className="num px-4 py-3 text-muted">
                  {u.lastSignInAt ? formatDate(u.lastSignInAt) : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1.5">
                    {u.isAdmin ? (
                      <span className="rounded-base border border-accent/40 px-1.5 py-0.5 text-xs text-accent">
                        Admin
                      </span>
                    ) : (
                      <span className="rounded-base border border-border px-1.5 py-0.5 text-xs text-muted">
                        Cliente
                      </span>
                    )}
                    {u.banned && (
                      <span className="rounded-base border border-danger/50 px-1.5 py-0.5 text-xs text-danger">
                        Bloccato
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-3">
                    {u.isAdmin ? (
                      <IconButton
                        action={setUserRole}
                        hidden={{ id: u.id, makeAdmin: "false" }}
                        tone="muted"
                        confirm={
                          self
                            ? undefined
                            : `Rimuovere i privilegi admin a ${u.email}?`
                        }
                      >
                        <ShieldOff className="size-3.5" aria-hidden />
                        {self ? "" : "Rimuovi admin"}
                      </IconButton>
                    ) : (
                      <IconButton
                        action={setUserRole}
                        hidden={{ id: u.id, makeAdmin: "true" }}
                        tone="accent"
                        confirm={`Rendere ${u.email} un amministratore?`}
                      >
                        <ShieldCheck className="size-3.5" aria-hidden />
                        Rendi admin
                      </IconButton>
                    )}

                    {!self &&
                      (u.banned ? (
                        <IconButton
                          action={setUserBan}
                          hidden={{ id: u.id, ban: "false" }}
                          tone="accent"
                        >
                          <CircleCheck className="size-3.5" aria-hidden />
                          Sblocca
                        </IconButton>
                      ) : (
                        <IconButton
                          action={setUserBan}
                          hidden={{ id: u.id, ban: "true" }}
                          tone="danger"
                          confirm={`Bloccare l'accesso a ${u.email}?`}
                        >
                          <Ban className="size-3.5" aria-hidden />
                          Blocca
                        </IconButton>
                      ))}

                    {!self && (
                      <IconButton
                        action={deleteUser}
                        hidden={{ id: u.id }}
                        tone="danger"
                        confirm={`Eliminare definitivamente ${u.email}? L'operazione non è reversibile.`}
                      >
                        <Trash2 className="size-3.5" aria-hidden />
                        Elimina
                      </IconButton>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
