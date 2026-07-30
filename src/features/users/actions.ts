"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { getAdminCaller } from "@/lib/auth/require-admin";

function refresh() {
  revalidatePath("/admin/users");
}

/**
 * Promuove o rimuove il ruolo admin scrivendo app_metadata.role.
 * Nota: un admin definito tramite allowlist ADMIN_EMAILS resta admin anche
 * dopo questa operazione (il ruolo via email ha la precedenza in isAdminUser).
 */
export async function setUserRole(formData: FormData): Promise<void> {
  const caller = await getAdminCaller();
  if (!caller) return;

  const id = String(formData.get("id") || "");
  const makeAdmin = String(formData.get("makeAdmin") || "") === "true";
  if (!id) return;
  // Un admin non può rimuovere il ruolo a se stesso (evita il lock-out).
  if (id === caller.id && !makeAdmin) return;

  const admin = createAdminClient();
  if (!admin) return;
  await admin.auth.admin.updateUserById(id, {
    app_metadata: { role: makeAdmin ? "admin" : "customer" },
  });
  refresh();
}

/** Blocca o sblocca l'accesso di un utente (ban a tempo lunghissimo). */
export async function setUserBan(formData: FormData): Promise<void> {
  const caller = await getAdminCaller();
  if (!caller) return;

  const id = String(formData.get("id") || "");
  const ban = String(formData.get("ban") || "") === "true";
  if (!id || id === caller.id) return; // non bloccare se stesso

  const admin = createAdminClient();
  if (!admin) return;
  await admin.auth.admin.updateUserById(id, {
    ban_duration: ban ? "876000h" : "none",
  });
  refresh();
}

/** Elimina definitivamente un utente. Non consentito su se stessi. */
export async function deleteUser(formData: FormData): Promise<void> {
  const caller = await getAdminCaller();
  if (!caller) return;

  const id = String(formData.get("id") || "");
  if (!id || id === caller.id) return;

  const admin = createAdminClient();
  if (!admin) return;
  await admin.auth.admin.deleteUser(id);
  refresh();
}
