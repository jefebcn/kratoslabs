-- Campi recensione per la Galleria Touchdown (pagina testimonianza dedicata):
-- voto, autore, paese, data e prodotti collegati.
-- Esegui nel dashboard Supabase: SQL Editor -> New query -> Run.

alter table public.gallery
  add column if not exists rating       integer not null default 5,
  add column if not exists author       text not null default '',
  add column if not exists country      text not null default '',
  add column if not exists review_date  text not null default '',
  add column if not exists product_slugs text[] not null default '{}';
