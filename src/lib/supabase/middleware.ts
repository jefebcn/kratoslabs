import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  isSupabaseConfigured,
  isAdminUser,
} from "./config";
import { safeNext } from "@/lib/safe-next";

/**
 * Aggiorna la sessione Supabase a ogni richiesta e applica le regole d'accesso:
 *  - /admin richiede utente autenticato E admin;
 *  - /login e /register, se già loggato, rimandano a ?next= o all'account.
 * Se Supabase non è configurato, lascia passare tutto (utile in locale).
 */
export async function updateSession(request: NextRequest) {
  if (!isSupabaseConfigured) return NextResponse.next({ request });

  try {
    return await runSession(request);
  } catch {
    // Un errore di auth (rete, chiavi errate, runtime) non deve mai far cadere
    // l'intero sito: si prosegue senza sessione. /admin resta protetto anche
    // dal controllo lato server nel layout.
    return NextResponse.next({ request });
  }
}

async function runSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANTE: non inserire logica tra createServerClient e getUser().
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  const redirectTo = (pathname: string, next?: string, search = "") => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = search;
    if (next) url.searchParams.set("next", next);
    const redirect = NextResponse.redirect(url);
    // Preserva i cookie di sessione eventualmente aggiornati.
    response.cookies.getAll().forEach((c) => redirect.cookies.set(c));
    return redirect;
  };

  if (path.startsWith("/admin")) {
    if (!user) return redirectTo("/login", path);
    if (!isAdminUser(user)) return redirectTo("/");
  }

  // Già collegato: si va a destinazione o all'account. Non alla home: chi
  // tocca "Accedi" dalla home (es. dal menu mobile, aperto prima che la
  // sessione fosse letta) resterebbe dov'è e penserebbe che il tasto non vada.
  if (user && (path === "/login" || path === "/register")) {
    const next = safeNext(request.nextUrl.searchParams.get("next"), "/account");
    let url = new URL(next, request.nextUrl.origin);
    // ?next=/login rimanderebbe qui all'infinito.
    if (url.pathname === "/login" || url.pathname === "/register") {
      url = new URL("/account", request.nextUrl.origin);
    }
    return redirectTo(url.pathname, undefined, url.search);
  }

  return response;
}
