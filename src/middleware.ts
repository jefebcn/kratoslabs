import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * Indirizzo Vercel di produzione: serve lo stesso sito del dominio, ma il
 * captcha (Turnstile) è autorizzato solo su kratoslabs.shop e lì fallisce
 * con l'errore 110200. Chi ci arriva (link vecchi, segnalibri, icona sulla
 * home del telefono) viene portato sul dominio vero. Le anteprime dei branch
 * (*-git-*.vercel.app) restano raggiungibili.
 */
const VERCEL_PRODUCTION_HOST = "kratoslabs.vercel.app";
const CANONICAL_ORIGIN = "https://www.kratoslabs.shop";

export async function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  if (host === VERCEL_PRODUCTION_HOST) {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(`${CANONICAL_ORIGIN}${pathname}${search}`, 308);
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Esegui su tutte le rotte tranne asset statici e file con estensione.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)",
  ],
};
