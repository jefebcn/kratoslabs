-- Scadenza punti (90 giorni) e bonus una tantum.
-- I punti guadagnati (earn/bonus) scadono dopo 90 giorni; le scritture negative
-- (redeem) e i rimborsi non hanno scadenza. Il saldo esclude i punti scaduti.
-- Esegui nel dashboard Supabase: SQL Editor -> New query -> Run.

alter table public.reward_ledger
  add column if not exists expires_at timestamptz;

create index if not exists reward_ledger_expires_idx
  on public.reward_ledger (expires_at);
