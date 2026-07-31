-- Galleria "Touchdown": foto reali dei clienti mostrate in home. Gestibile
-- dall'admin (import dal browser, upload manuale, riordino, eliminazione).
-- Le foto NON sono segrete: lettura pubblica; le scritture passano solo dal
-- service role che bypassa la RLS.
-- Esegui nel dashboard Supabase: SQL Editor -> New query -> Run.

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  alt text not null default '',
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.gallery enable row level security;

drop policy if exists "gallery_public_read" on public.gallery;
create policy "gallery_public_read"
  on public.gallery for select
  using (true);

create index if not exists gallery_position_idx on public.gallery (position);
