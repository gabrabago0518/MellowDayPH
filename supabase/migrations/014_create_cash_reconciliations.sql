-- End-of-day cash reconciliation: a cashier counts the cash drawer at
-- close and the system compares it against what the day's cash orders
-- say should be there. Gives the owner an audit trail of who closed each
-- day and whether the drawer was over, short, or exact.
create table if not exists cash_reconciliations (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references staff(id),
  staff_username text not null,
  business_date date not null,
  total_orders integer not null,
  total_sales numeric not null,
  cash_expected numeric not null,
  gcash_total numeric not null,
  cash_counted numeric not null,
  cash_difference numeric not null,
  created_at timestamptz not null default now()
);

create index if not exists cash_reconciliations_created_at_idx on cash_reconciliations (created_at desc);

alter table cash_reconciliations enable row level security;

-- Deliberately no policies for anon/authenticated: cashiers write a
-- closing through /api/cashier/day-summary/close (service role), the
-- owner reads the history through /api/admin/cash-reconciliations
-- (service role). Nothing reads or writes this table directly from the
-- browser.
