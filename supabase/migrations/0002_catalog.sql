-- Kratos Labs — catalogo gestibile da admin (categorie, prodotti, immagini).
-- Esegui nel dashboard Supabase: SQL Editor -> New query -> Run.

-- ─────────────────────────────  CATEGORIE  ─────────────────────────────
create table if not exists public.categories (
  slug        text primary key,
  name        text not null,
  description text not null default '',
  position    integer not null default 0,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────  PRODOTTI  ──────────────────────────────
create table if not exists public.products (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  brand         text not null default 'KratosLabs',
  title         text not null,
  short_description text not null default '',
  description   text not null default '',
  category      text references public.categories (slug) on delete set null,
  price_cents   integer not null default 0 check (price_cents >= 0),
  compare_at_price_cents integer,
  images        jsonb not null default '[]'::jsonb,  -- [{url, alt}]
  specs         jsonb not null default '{}'::jsonb,
  lab_report    jsonb,
  stock         integer not null default 0 check (stock >= 0),
  featured      boolean not null default false,
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists products_category_idx on public.products (category);
create index if not exists products_active_idx on public.products (active);

-- ─────────────────────────────  RLS  ───────────────────────────────────
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- Lettura pubblica solo delle righe attive (storefront).
drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read" on public.categories
  for select using (active = true);

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read" on public.products
  for select using (active = true);

-- Scrittura riservata agli admin (ruolo "admin" nel JWT). La SERVICE ROLE KEY
-- usata dal server bypassa comunque la RLS.
drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all" on public.categories
  for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all" on public.products
  for all using ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin')
  with check ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- ────────────────────────  STORAGE (immagini)  ─────────────────────────
-- Bucket pubblico per le immagini prodotto.
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "product_images_public_read" on storage.objects;
create policy "product_images_public_read" on storage.objects
  for select using (bucket_id = 'product-images');

drop policy if exists "product_images_admin_write" on storage.objects;
create policy "product_images_admin_write" on storage.objects
  for all
  using (
    bucket_id = 'product-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  )
  with check (
    bucket_id = 'product-images'
    and (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- ────────────────────────  SEED categorie  ─────────────────────────────
insert into public.categories (slug, name, description, position) values
  ('proteine',    'Proteine',    'Isolati e concentrati, profilo aminoacidico dichiarato.', 1),
  ('creatina',    'Creatina',    'Monoidrato micronizzato, purezza certificata.',           2),
  ('pre-workout', 'Pre-workout', 'Formule a dosaggio pieno, senza proprietary blend.',       3),
  ('elettroliti', 'Elettroliti', 'Sodio, potassio e magnesio in rapporti misurati.',         4),
  ('omega-3',     'Omega-3',     'EPA e DHA quantificati, test su metalli pesanti.',         5),
  ('vitamine',    'Vitamine',    'Micronutrienti in forme biodisponibili.',                  6)
on conflict (slug) do nothing;
