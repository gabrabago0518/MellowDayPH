-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Adds a brute-force lockout to admin and cashier login: after repeated
-- failed password attempts against an existing account, that account is
-- temporarily locked out regardless of whether the next attempt is correct.

alter table public.admins
  add column if not exists failed_attempts int not null default 0,
  add column if not exists locked_until timestamptz;

alter table public.staff
  add column if not exists failed_attempts int not null default 0,
  add column if not exists locked_until timestamptz;
