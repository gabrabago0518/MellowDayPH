-- Run this once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- Creates the orders table used by /orders and checkout so signed-in
-- customers' order history follows their account across devices.

create table if not exists public.orders (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  method text not null check (method in ('gcash', 'cash')),
  status text not null check (status in ('pending', 'paid', 'placed', 'failed')),
  items jsonb not null,
  total numeric not null,
  fulfillment text not null check (fulfillment in ('pickup', 'delivery')),
  delivery_address text,
  name text not null,
  phone text not null
);

create index if not exists orders_user_id_created_at_idx
  on public.orders (user_id, created_at desc);

alter table public.orders enable row level security;

create policy "Users can view their own orders"
  on public.orders for select
  using (auth.uid() = user_id);

create policy "Users can insert their own orders"
  on public.orders for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own orders"
  on public.orders for update
  using (auth.uid() = user_id);
