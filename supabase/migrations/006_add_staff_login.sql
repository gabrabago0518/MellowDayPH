-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Turns `staff` rows into real login accounts for the cashier dashboard —
-- adds hiring/contact details and username+password credentials (set by an
-- admin from the Employees tab). Email is no longer required.

alter table public.staff
  add column if not exists date_hired date,
  add column if not exists contact_number text,
  add column if not exists username text unique,
  add column if not exists password_hash text;

alter table public.staff alter column email drop not null;
