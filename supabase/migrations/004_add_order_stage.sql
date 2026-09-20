-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Adds order-fulfillment tracking (separate from payment status) so
-- customers can follow "Confirmation -> Preparing -> Out for Delivery ->
-- Delivered" on /orders and staff can advance it from the admin dashboard.
-- Nullable: orders placed before this existed, or a GCash order still
-- awaiting payment, simply have no stage yet.

alter table public.orders
  add column if not exists stage text
  check (stage in ('confirmation', 'preparing', 'out_for_delivery', 'delivered'));
