-- Punti fedeltà (Reward Points). Ledger append-only: il saldo di un utente è la
-- somma dei suoi delta. Guadagno: 5 punti ogni 25€. Valore: 100 punti = 25€.
-- Esegui nel dashboard Supabase: SQL Editor -> New query -> Run.

create table if not exists public.reward_ledger (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users (id) on delete cascade,
  order_ref  text,
  delta      integer not null,
  reason     text not null,           -- 'earn' | 'redeem' | 'refund' | 'reverse' | 'adjust'
  created_at timestamptz not null default now()
);

create index if not exists reward_ledger_user_idx on public.reward_ledger (user_id);
create index if not exists reward_ledger_order_idx on public.reward_ledger (order_ref);

alter table public.reward_ledger enable row level security;

-- Un utente vede solo il proprio storico punti; le scritture passano dal
-- service role (checkout / admin) che bypassa la RLS.
drop policy if exists "reward_ledger_select_own" on public.reward_ledger;
create policy "reward_ledger_select_own" on public.reward_ledger
  for select using (auth.uid() = user_id);

-- Sconto punti applicato all'ordine.
alter table public.orders
  add column if not exists points_redeemed integer not null default 0,
  add column if not exists discount_cents  integer not null default 0;
