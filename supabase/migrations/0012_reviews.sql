-- Recensioni clienti (reali). Lettura pubblica; le scritture passano dal
-- service role (admin). Finché la tabella è vuota, il sito non mostra recensioni
-- (niente contenuti finti).
-- Esegui nel dashboard Supabase: SQL Editor -> New query -> Run.

create table if not exists public.reviews (
  id                uuid primary key default gen_random_uuid(),
  author            text not null default '',
  location          text not null default '',
  rating            integer not null default 5 check (rating between 1 and 5),
  title             text not null default '',
  body              text not null default '',
  product_slug      text not null default '',
  product_title     text not null default '',
  review_date       text not null default '',
  verified_purchase boolean not null default true,
  created_at        timestamptz not null default now()
);

create index if not exists reviews_product_idx on public.reviews (product_slug);

alter table public.reviews enable row level security;

drop policy if exists "reviews_public_read" on public.reviews;
create policy "reviews_public_read" on public.reviews
  for select using (true);
