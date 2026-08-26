import { NextResponse, type NextRequest } from "next/server";
import { getCurrentUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTrackingInfo } from "@/lib/tracking";

/**
 * Stato di tracciamento live (17TRACK) per un codice.
 * Protetto: risponde solo se l'utente autenticato possiede un ordine con quel
 * codice (per user_id o email), così la API key non è esposta ad abusi/quota.
 */
export async function GET(req: NextRequest) {
  const num = req.nextUrl.searchParams.get("num")?.trim();
  if (!num) {
    return NextResponse.json({ error: "missing" }, { status: 400 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "unavailable" }, { status: 503 });
  }

  // Verifica che il codice appartenga a un ordine dell'utente.
  const { data } = await admin
    .from("orders")
    .select("user_id, customer_email")
    .eq("tracking_id", num)
    .limit(1)
    .maybeSingle();

  const owns =
    data &&
    (data.user_id === user.id ||
      (Boolean(user.email) && data.customer_email === user.email));
  if (!owns) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const info = await getTrackingInfo(num);
  if (!info) {
    return NextResponse.json({ status: "unknown" });
  }
  return NextResponse.json(info);
}
