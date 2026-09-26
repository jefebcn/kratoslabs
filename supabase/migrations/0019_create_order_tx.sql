-- 0019_create_order_tx.sql
-- Checkout transazionale: stock, ordine e punti in un'unica transazione.
--
-- Prima di questa migrazione il checkout faceva tre operazioni separate e
-- nessuna delle tre era protetta:
--   1. l'errore dell'INSERT su `orders` non veniva mai controllato (il client
--      Supabase non solleva eccezioni: restituisce { error }), quindi il cliente
--      riceveva una pre-conferma per un ordine mai salvato;
--   2. lo stock non veniva mai decrementato, né controllato lato server;
--   3. il saldo punti veniva letto prima e scalato dopo, senza lock: due
--      checkout in parallelo potevano spendere gli stessi punti due volte, e se
--      la scrittura sul ledger falliva l'ordine restava a DB con lo sconto
--      applicato ma i punti non scalati.
--
-- `create_order` esegue tutto dentro una sola transazione: se un passo fallisce
-- viene annullato tutto, e l'applicazione riceve un errore esplicito.
--
-- I prezzi NON vengono ricalcolati qui: restano di competenza del server
-- applicativo (src/features/checkout/actions.ts), che li rilegge dal catalogo.
-- Questa funzione è l'esecutore transazionale e il guardiano di stock e punti.

begin;

-- Marcatore per il ripristino dello stock su annullamento (idempotente).
alter table public.orders
  add column if not exists stock_restored boolean not null default false;

-- ---------------------------------------------------------------------------
-- create_order: decrementa lo stock, inserisce l'ordine, scala i punti.
-- ---------------------------------------------------------------------------
create or replace function public.create_order(
  p_reference       text,
  p_user_id         uuid,
  p_customer_email  text,
  p_lines           jsonb,
  p_shipping        jsonb,
  p_payment_method  text,
  p_total_cents     integer,
  p_discount_cents  integer,
  p_points_redeemed integer
) returns uuid
language plpgsql
as $$
declare
  v_line     jsonb;
  v_qty      integer;
  v_updated  integer;
  v_balance  integer;
  v_points   integer := greatest(0, coalesce(p_points_redeemed, 0));
  v_order_id uuid;
begin
  -- 1. Stock: un UPDATE condizionato per riga. Postgres blocca la riga per la
  --    durata della transazione, quindi due checkout concorrenti sullo stesso
  --    prodotto si serializzano e non possono scendere sotto zero.
  for v_line in select * from jsonb_array_elements(p_lines)
  loop
    v_qty := coalesce((v_line ->> 'quantity')::integer, 0);
    if v_qty <= 0 then
      raise exception 'invalid_quantity' using errcode = 'P0001';
    end if;

    update public.products
       set stock = stock - v_qty,
           updated_at = now()
     where id = (v_line ->> 'productId')::uuid
       and stock >= v_qty;

    get diagnostics v_updated = row_count;
    if v_updated = 0 then
      -- Nessuna riga aggiornata: prodotto inesistente o scorte insufficienti.
      raise exception 'insufficient_stock:%', coalesce(v_line ->> 'slug', '?')
        using errcode = 'P0001';
    end if;
  end loop;

  -- 2. Punti: il saldo viene riletto QUI, dentro la transazione, così due
  --    checkout in parallelo non possono spendere lo stesso credito.
  if p_user_id is not null and v_points > 0 then
    select coalesce(sum(delta), 0)::integer into v_balance
      from public.reward_ledger
     where user_id = p_user_id
       and (expires_at is null or expires_at > now());

    if coalesce(v_balance, 0) < v_points then
      raise exception 'insufficient_points' using errcode = 'P0001';
    end if;
  else
    v_points := 0;
  end if;

  -- 3. Ordine.
  insert into public.orders (
    reference, user_id, customer_email, status,
    total_cents, discount_cents, points_redeemed,
    lines, shipping, payment_method, payment_status
  ) values (
    p_reference, p_user_id, p_customer_email, 'pending',
    p_total_cents, greatest(0, coalesce(p_discount_cents, 0)), v_points,
    p_lines, p_shipping, p_payment_method, 'unpaid'
  )
  returning id into v_order_id;

  -- 4. Ledger punti: stessa transazione dell'ordine, quindi o ci sono
  --    entrambi o non c'è nessuno dei due.
  if v_points > 0 then
    insert into public.reward_ledger (user_id, delta, reason, order_ref, expires_at)
    values (p_user_id, -v_points, 'redeem', p_reference, null);
  end if;

  return v_order_id;
end;
$$;

-- ---------------------------------------------------------------------------
-- restore_order_stock: rimette a magazzino le quantità di un ordine annullato.
-- Idempotente: il flag `stock_restored` viene alzato nella stessa transazione,
-- quindi due annullamenti consecutivi non gonfiano lo stock.
-- ---------------------------------------------------------------------------
create or replace function public.restore_order_stock(p_order_id uuid)
returns boolean
language plpgsql
as $$
declare
  v_lines jsonb;
  v_line  jsonb;
  v_qty   integer;
begin
  update public.orders
     set stock_restored = true
   where id = p_order_id
     and stock_restored = false
  returning lines into v_lines;

  if v_lines is null then
    return false; -- già ripristinato, o ordine inesistente
  end if;

  for v_line in select * from jsonb_array_elements(v_lines)
  loop
    v_qty := coalesce((v_line ->> 'quantity')::integer, 0);
    if v_qty > 0 then
      update public.products
         set stock = stock + v_qty,
             updated_at = now()
       where id = (v_line ->> 'productId')::uuid;
    end if;
  end loop;

  return true;
end;
$$;

-- ---------------------------------------------------------------------------
-- Permessi: queste funzioni scrivono ordini e punti senza passare dalla RLS,
-- quindi devono essere invocabili SOLO dal service role (il server). Se fossero
-- eseguibili da `anon`/`authenticated`, un client potrebbe creare ordini con
-- totali arbitrari — esattamente il buco chiuso dalla migrazione 0018.
-- ---------------------------------------------------------------------------
-- `create or replace function` conserva i privilegi già concessi, quindi il
-- revoke esplicito su anon/authenticated non è ridondante. I ruoli vengono
-- filtrati per esistenza, così la migrazione resta applicabile anche su un
-- Postgres vuoto (sviluppo locale, CI) dove i ruoli Supabase non ci sono.
do $$
declare
  v_fn   text;
  v_role text;
begin
  foreach v_fn in array array[
    'public.create_order(text, uuid, text, jsonb, jsonb, text, integer, integer, integer)',
    'public.restore_order_stock(uuid)'
  ]
  loop
    execute format('revoke all on function %s from public', v_fn);

    foreach v_role in array array['anon', 'authenticated', 'service_role']
    loop
      if exists (select 1 from pg_roles where rolname = v_role) then
        if v_role = 'service_role' then
          execute format('grant execute on function %s to %I', v_fn, v_role);
        else
          execute format('revoke all on function %s from %I', v_fn, v_role);
        end if;
      end if;
    end loop;
  end loop;
end
$$;

commit;
