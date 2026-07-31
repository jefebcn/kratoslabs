-- Testo recensione mostrato in overlay sulle foto della Galleria Touchdown.
-- Esegui nel dashboard Supabase: SQL Editor -> New query -> Run.

alter table public.gallery
  add column if not exists caption text not null default '';
