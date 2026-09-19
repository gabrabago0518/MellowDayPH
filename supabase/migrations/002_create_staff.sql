-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Creates the staff table the admin dashboard's Employees tab reads and
-- writes. Only ever accessed through the service-role admin API, so RLS is
-- enabled with no policies — that blocks every client-side/anon request
-- outright, while the service-role key (which bypasses RLS) keeps working.

create table if not exists public.staff (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  role text not null default 'Staff',
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz not null default now()
);

create index if not exists staff_created_at_idx on public.staff (created_at desc);

alter table public.staff enable row level security;
