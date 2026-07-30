-- Kratos Labs — schema ordini per il checkout reale.
-- Esegui questo SQL nel dashboard Supabase: SQL Editor -> New query -> Run.

create table if not exists public.orders (
  id            uuid primary key default gen_random_uuid(),
  reference     text unique not null,
  user_id       uuid references auth.users (id) on delete set null,
  customer_email text not null,
  status        text not null default 'pending'
                 check (status in ('pending','processing','shipped','delivered','cancelled')),
  total_cents   integer not null check (total_cents >= 0),
  -- righe dell'ordine come JSON (snapshot: titolo/prezzo al momento dell'acquisto)
  lines         jsonb not null default '[]'::jsonb,
  -- dati di spedizione (nome, indirizzo, città, CAP, paese, note)
  shipping      jsonb not null default '{}'::jsonb,
  payment_method text,
  payment_status text not null default 'unpaid'
                 check (payment_status in ('unpaid','paid','refunded','failed')),
  tracking_id   text,
  created_at    timestamptz not null default now()
);

create index if not exists orders_user_id_idx on public.orders (user_id);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

alter table public.orders enable row level security;

-- Un utente autenticato vede e crea solo i propri ordini.
drop policy if exists "orders_select_own" on public.orders;
create policy "orders_select_own" on public.orders
  for select using (auth.uid() = user_id);

drop policy if exists "orders_insert_own" on public.orders;
create policy "orders_insert_own" on public.orders
  for insert with check (auth.uid() = user_id);

-- Gli admin (ruolo "admin" nei metadati Supabase) vedono e aggiornano tutto.
drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all" on public.orders
  for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Nota: la creazione ordini dal server (Server Action) userà la SERVICE ROLE KEY,
-- che bypassa la RLS, così il server controlla totali e stato in modo sicuro.
