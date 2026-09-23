-- Moves the menu from a hardcoded array in src/lib/menu-data.ts into the
-- database, so an admin can add a drink or change a price from the
-- dashboard instead of needing a code change and redeploy.
create table if not exists menu_items (
  id text primary key,
  name text not null,
  price integer not null check (price >= 0),
  category text not null,
  color text not null default '#5C3A1E',
  image text,
  description text,
  available boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table menu_items enable row level security;

-- The menu is public information — readable by anyone, anonymous or not.
-- All writes go through the service-role admin API only; there are
-- deliberately no insert/update/delete policies here for anon/authenticated.
create policy "Public can read menu items"
  on menu_items for select
  using (true);
