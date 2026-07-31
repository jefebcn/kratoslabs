-- Scheda descrittiva estesa per prodotto (Product Overview, Key Features,
-- Benefits, Usage, Important Information, Storage, Disclaimer…).
-- HTML sanificato lato server: solo tag di testo, senza attributi/script.
-- Esegui nel dashboard Supabase: SQL Editor -> New query -> Run.

alter table public.products
  add column if not exists details_html text;
