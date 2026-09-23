-- Self-hosted error tracking: a place to actually see when something
-- breaks (a checkout throwing an uncaught exception, a client-side render
-- crash) instead of only finding out from a customer complaint or by
-- combing through Vercel's raw function logs.
create table if not exists error_logs (
  id uuid primary key default gen_random_uuid(),
  source text not null check (source in ('server', 'client')),
  route text,
  message text not null,
  stack text,
  context jsonb,
  created_at timestamptz not null default now()
);

create index if not exists error_logs_created_at_idx on error_logs (created_at desc);

alter table error_logs enable row level security;

-- Deliberately no policies for anon/authenticated: every write goes
-- through /api/errors (server-side, service role) or an API route's own
-- catch block, and every read goes through /api/admin/errors (admin-auth
-- + service role). Nothing reads or writes this table directly from the
-- browser.
