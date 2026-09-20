-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Customers can leave an optional note at checkout (e.g. "extra tissue,
-- extra spoon") for staff preparing the order.

alter table public.orders
  add column if not exists special_instructions text;
