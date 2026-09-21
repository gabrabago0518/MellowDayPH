-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
--
-- SECURITY FIX: customers previously could INSERT/UPDATE their own orders
-- directly via the browser (anon key), since RLS only checked
-- auth.uid() = user_id and never restricted which fields could be written.
-- That let any signed-in customer fabricate a whole order at any price, or
-- mark an existing order "paid"/"delivered" themselves, via a raw REST call
-- to Supabase — completely bypassing checkout price computation and GCash
-- payment verification.
--
-- Order creation and every status/stage change now go through server API
-- routes (using the service-role key, which bypasses RLS) that recompute
-- price and/or verify payment server-side before writing. Customers keep
-- read-only access to their own orders.

drop policy if exists "Users can insert their own orders" on public.orders;
drop policy if exists "Users can update their own orders" on public.orders;
