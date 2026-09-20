-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Records when each fulfillment stage was actually reached, so the order
-- tracker can show a timestamp per step, not just the current stage.

alter table public.orders
  add column if not exists stage_history jsonb not null default '{}'::jsonb;
