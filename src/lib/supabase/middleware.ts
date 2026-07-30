import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  isSupabaseConfigured,
  isAdminUser,
} from "./config";

/**
 * Aggiorna la sessione Supabase a ogni richiesta e applica le regole d'accesso:
 *  - /admin richiede utente autenticato E admin;
 *  - /login e /register, se già loggato, rimandano alla home.
 * Se Supabase non è configurato, lascia passare tutto (utile in locale).
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  if (!isSupabaseConfigured) return response;

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

  const redirectTo = (pathname: string, next?: string) => {
    const url = request.nextUrl.clone();
    url.pathname = pathname;
    url.search = "";
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

  if (user && (path === "/login" || path === "/register")) {
    return redirectTo("/");
  }

  return response;
}
