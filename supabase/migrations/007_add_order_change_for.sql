-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Cash on Delivery orders can note the bill the customer will pay with (e.g.
-- "change for ₱500") so the rider knows how much change to bring. Nullable —
-- most orders (GCash, pickup, or exact cash) simply won't set it.

alter table public.orders
  add column if not exists change_for numeric;
