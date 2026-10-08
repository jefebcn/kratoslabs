import "server-only";
import { SITE } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import { isEmailConfigured, sendEmailResult } from "@/lib/email/resend";
import type { EmailContent } from "@/lib/email/templates";

/**
 * Destinatari delle notifiche admin (nuovo ordine, nuovo iscritto):
 *  - ADMIN_NOTIFY_EMAIL (env, separate da virgole), se impostata, vince su tutto;
 *  - altrimenti le email in ADMIN_EMAILS più gli utenti con ruolo "admin"
 *    (`app_metadata.role`, lo stesso criterio di `isAdminUser`);
 *  - se non c'è nessuno, la casella del negozio (SITE.email).
 */
function splitEmails(raw: string | undefined): string[] {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter((s) => s.includes("@"));
}

async function adminRoleEmails(): Promise<string[]> {
  const admin = createAdminClient();
  if (!admin) return [];
  try {
    const { data, error } = await admin.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    if (error || !data) return [];
    return data.users
      .filter((u) => u.app_metadata?.role === "admin" && u.email)
      .map((u) => String(u.email).toLowerCase());
  } catch {
    return [];
  }
}

export async function adminRecipients(): Promise<string[]> {
  const explicit = splitEmails(process.env.ADMIN_NOTIFY_EMAIL);
  if (explicit.length) return [...new Set(explicit)];

  const all = [
    ...splitEmails(process.env.ADMIN_EMAILS),
    ...(await adminRoleEmails()),
  ];
  return all.length ? [...new Set(all)] : [SITE.email];
}

/**
 * Invia una notifica a tutti gli admin. Non lancia mai: un errore viene solo
 * scritto nei log (Vercel → Logs), così non può rompere checkout o login.
 */
export async function notifyAdmins(
  { subject, html, text }: EmailContent,
  replyTo?: string,
): Promise<boolean> {
  if (!isEmailConfigured) {
    console.error(`[admin-notify] email non configurata, salto: ${subject}`);
    return false;
  }
  const to = await adminRecipients();
  const res = await sendEmailResult({ to, subject, html, text, replyTo });
  if (!res.ok) {
    console.error(
      `[admin-notify] invio fallito (${res.status ?? "-"}): ${res.error ?? "errore sconosciuto"} — ${subject}`,
    );
  }
  return res.ok;
}
