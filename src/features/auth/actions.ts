"use server";

import { redirect } from "next/navigation";
import { after } from "next/server";
import { notifyAdmins } from "@/lib/email/admin-notify";
import { adminNewSignupEmail } from "@/lib/email/templates";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Chiude la sessione e torna alla home. Usata come form action nell'header. */
export async function signOut() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/");
}

/** Finestra entro cui un account è considerato "appena creato". */
const SIGNUP_WINDOW_MS = 15 * 60 * 1000;

/**
 * Avvisa gli admin di una nuova registrazione. Chiamata da AuthForm subito
 * dopo `signUp` (che avviene nel browser) con l'id del nuovo utente.
 *
 * L'id arriva dal client, quindi non ci si fida: l'utente deve esistere, essere
 * stato creato da pochi minuti e non essere già stato notificato. Il flag
 * `app_metadata.signup_notified_at` (scrivibile solo dal service role) rende
 * la notifica unica anche se la funzione viene richiamata più volte.
 */
export async function notifySignup(userId: string): Promise<void> {
  if (typeof userId !== "string" || !/^[0-9a-f-]{36}$/i.test(userId)) return;
  const admin = createAdminClient();
  if (!admin) return;

  try {
    const { data, error } = await admin.auth.admin.getUserById(userId);
    const user = data?.user;
    if (error || !user?.email) return;

    const created = Date.parse(user.created_at);
    if (!Number.isFinite(created) || Date.now() - created > SIGNUP_WINDOW_MS) {
      return;
    }
    if (user.app_metadata?.signup_notified_at) return;

    // Marca prima di inviare: due chiamate ravvicinate non producono due email.
    const { error: markError } = await admin.auth.admin.updateUserById(userId, {
      app_metadata: {
        ...user.app_metadata,
        signup_notified_at: new Date().toISOString(),
      },
    });
    if (markError) return;

    const name = String(user.user_metadata?.full_name ?? "").trim();
    after(() =>
      notifyAdmins(
        adminNewSignupEmail({
          email: user.email!,
          name: name || undefined,
          createdAt: user.created_at,
          confirmed: Boolean(user.email_confirmed_at),
        }),
        user.email,
      ).then(() => undefined),
    );
  } catch (e) {
    console.error(
      "[signup-notify]",
      e instanceof Error ? e.message : e,
    );
  }
}
