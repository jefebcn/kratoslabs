-- 0017_featured_bestsellers.sql
-- Imposta i prodotti "Bestseller" mostrati in home (tab Bestseller sotto il
-- carosello, alimentato da products.featured).
--
-- Selezione curata e distribuita sulle categorie principali. Idempotente:
-- azzera prima tutti i flag e poi riattiva solo l'elenco scelto, così
-- rieseguendo la migrazione l'insieme dei bestseller resta identico.

begin;

-- Reset: nessun bestseller residuo da import o modifiche precedenti.
update public.products
set featured = false, updated_at = now()
where featured = true;

-- Bestseller scelti (copertura multi-categoria).
update public.products
set featured = true, updated_at = now()
where slug in (
  -- Iniettabili
  'testomed-e-250',   -- Testosterone Enanthate
  'sustamed-250',     -- Testosterone blend (Sustanon)
  'trenbomed-e-200',  -- Trenbolone Enanthate
  'decamed-250',      -- Nandrolone Decanoate
  -- Orali
  'anavamed-10',      -- Oxandrolone
  'dianamed-10',      -- Methandienone
  -- Brucia grassi
  'clenomed-40',      -- Clenbuterol
  'tirzepatide',      -- GLP-1 (GIP/GLP-1)
  -- SARMs
  'rad140-10',        -- Testolone (RAD-140)
  -- HGH & Peptidi
  'bpc-157',          -- BPC-157
  -- Post Cycle
  'nolvamed-20',      -- Tamoxifen
  -- Sex Support
  'ciamed-5'          -- Tadalafil
);

commit;
