-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Creates a fully separate admin-accounts table, independent of the
-- `auth.users` table customers sign up into. Admin login is username +
-- password against this table, not email against Supabase Auth. Only ever
-- accessed through the service-role admin API, so RLS is enabled with no
-- policies — that blocks every client-side/anon request outright.

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password_hash text not null,
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;
