-- Impostazioni del sito modificabili dall'admin (annunci, coordinate di
-- pagamento, spedizione, email). Riga unica con chiave 'site' e valore JSONB.
-- I valori NON sono segreti (annunci, IBAN e indirizzi crypto sono dati di
-- ricezione pubblici), quindi la lettura è pubblica; le scritture passano solo
-- dal service role che bypassa la RLS.

create table if not exists public.settings (
  key text primary key,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.settings enable row level security;

drop policy if exists "settings_public_read" on public.settings;
create policy "settings_public_read"
  on public.settings for select
  using (true);

-- Riga di configurazione iniziale (vuota: i default arrivano dal codice).
insert into public.settings (key, value)
values ('site', '{}'::jsonb)
on conflict (key) do nothing;
