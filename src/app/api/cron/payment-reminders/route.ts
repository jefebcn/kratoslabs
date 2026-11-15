import { NextResponse, type NextRequest } from "next/server";
import { runPaymentReminders } from "@/features/orders/reminders";

// Lo chiama Vercel Cron una volta al giorno (vedi vercel.json).
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Con CRON_SECRET impostata su Vercel, Vercel Cron la invia come
 * "Authorization: Bearer …" e qui la si esige. Senza, la rotta resta
 * eseguibile da chiunque, ma il controllo è idempotente: manda solo i
 * promemoria già dovuti e mai due volte lo stesso.
 */
export async function GET(request: NextRequest) {
  const secret = (process.env.CRON_SECRET ?? "").trim();
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const result = await runPaymentReminders();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
