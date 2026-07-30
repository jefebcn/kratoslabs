-- Kratos Labs — rende visibili (a 0€) i prodotti che nel listino Deus erano
-- senza prezzo. Restano a price_cents = 0 finché l'admin non imposta un prezzo.
-- Esegui nel dashboard Supabase: SQL Editor -> New query -> Run.

update public.products
set active = true, stock = 100
where slug in (
  'deustropin-pen-10',
  'deustropin-pen-15',
  'epo',
  'igf-1-des',
  'igf-1-lr3'
);
