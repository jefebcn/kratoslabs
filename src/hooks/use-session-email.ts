"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Email dell'utente collegato, letta dalla sessione lato client (i cookie
 * Supabase sono condivisi col server) e aggiornata a ogni login/logout.
 * `ready` è false finché la sessione non è stata letta.
 */
export function useSessionEmail() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setReady(true);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  async function logout() {
    if (isSupabaseConfigured) {
      await createClient().auth.signOut();
    }
    setEmail(null);
    router.push("/");
    router.refresh();
  }

  return { email, ready, logout };
}
