-- 0018_orders_drop_insert_own.sql
-- Sicurezza: rimuove la policy che permetteva a un utente autenticato di
-- inserire righe in `orders` direttamente via API REST.
--
-- La policy era:
--   create policy "orders_insert_own" on public.orders
--     for insert with check (auth.uid() = user_id);
--
-- Il vincolo copriva solo `user_id`: non `total_cents`, non `status`, non
-- `payment_status`. Con la sola chiave pubblica e il proprio JWT un cliente
-- poteva quindi creare un ordine a 0 €, già marcato `paid`/`processing`, con
-- dentro la merce che voleva — scavalcando del tutto la Server Action di
-- checkout (che è l'unico punto dove prezzi, spedizione, minimo d'ordine e
-- punti vengono ricalcolati lato server).
--
-- Gli ordini legittimi nascono esclusivamente dal service role in
-- `src/features/checkout/actions.ts` (createAdminClient), che bypassa la RLS:
-- rimuovere questa policy non toglie quindi nessuna funzionalità.
--
-- Restano attive:
--   * orders_select_own  -> il cliente continua a leggere i propri ordini
--   * orders_admin_all   -> accesso completo per il ruolo admin
-- Nessun percorso applicativo inserisce in `orders` con la chiave pubblica.

begin;

drop policy if exists "orders_insert_own" on public.orders;

commit;
