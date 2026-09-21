# Supabase setup

Two one-time steps to run in your Supabase project's dashboard — neither
can be done from the app code itself.

## 1. Create the orders table

Dashboard → **SQL Editor** → New query → paste the contents of
`migrations/001_create_orders.sql` → **Run**.

This creates the `orders` table (with row-level security so each customer
only ever sees their own orders) that signed-in customers' order history
is saved to.

## 2. Brand the confirmation email

Dashboard → **Authentication** → **Emails** → **Confirm signup** → replace
the template body with the contents of `email-templates/confirm-signup.html`
→ **Save**.

This is the email sent when someone signs up; it links back to
`/auth/confirm` on the site, which shows a "you're confirmed" page and
logs them in.

## 3. Admin dashboard (/admin)

Admin accounts are completely separate from customer accounts — they live
in their own `admins` table and log in with a **username and password**,
never an email or Supabase Auth.

Dashboard → **SQL Editor** → New query → paste the contents of
`migrations/003_create_admins.sql` → **Run**.

In Vercel → Project Settings → Environment Variables, add:

- `SUPABASE_SERVICE_ROLE_KEY` (type: **Secret**) — Supabase dashboard →
  Settings → API → "Secret keys". Server-only; never exposed to the browser.
- `ADMIN_SESSION_SECRET` (type: **Secret**) — a long random string used to
  sign admin login session cookies, e.g. generate one with
  `openssl rand -hex 32`.
- `ADMIN_SETUP_KEY` (type: **Secret**) — a secret only you know, used once
  at `/admin/setup` to create your first admin account (and any additional
  ones later, though you can also add more from the Settings tab once
  logged in). You can remove this from Vercel afterward if you don't expect
  to use `/admin/setup` again.

Vercel env var changes only apply to deployments created *after* they're
saved — the currently-live deployment won't pick them up on its own. After
saving these, trigger a new deployment (Deployments tab → the latest one's
**⋯** menu → Redeploy, or just push any commit to `main`) and confirm its
Production entry shows a timestamp *after* you saved the variables.

Once that deployment is live, go to `/admin/setup`, enter the setup key
plus your desired username and password, and you'll have your first admin
account.

## 4. Employees tab (/admin/employees)

Dashboard → **SQL Editor** → New query → paste the contents of
`migrations/002_create_staff.sql` → **Run**.

This creates the `staff` table the Employees tab reads and writes (a staff
directory — separate from admin login accounts). It's only ever accessed
through the service-role admin API, so no further Vercel configuration is
needed beyond step 3 above.

## 5. Order tracking (Confirmation → Preparing → Out for Delivery → Delivered)

Dashboard → **SQL Editor** → New query → paste the contents of
`migrations/004_add_order_stage.sql` → **Run**.

This adds a `stage` column to the existing `orders` table. No Vercel
configuration needed — it's used automatically once the column exists.

## 6. Order stage timestamps

Dashboard → **SQL Editor** → New query → paste the contents of
`migrations/005_add_order_stage_history.sql` → **Run**.

This adds a `stage_history` column recording when each step was reached,
so the tracker can show a timestamp (Philippines time) per step, not just
the current one.

## 7. Cashier dashboard (/cashier)

Dashboard → **SQL Editor** → New query → paste the contents of
`migrations/006_add_staff_login.sql` → **Run**.

This turns `staff` rows into real login accounts — adds date hired, contact
number, username, and password columns. No new Vercel env vars needed: the
cashier dashboard reuses `ADMIN_SESSION_SECRET` (already set up in step 3)
to sign its own separate login cookie.

Only an admin can create cashier accounts — go to `/admin` → **Employees**
→ **Add Employee** and fill in Full Name, Date Hired, Role, Contact Number,
plus a Username and Password for that employee to log in with at
`/cashier/login`. Deactivating an employee (toggle their status to
Inactive) also blocks them from logging in.

The cashier dashboard has a single Orders tab: cashiers can advance an
order through Confirmation → Preparing → Out for Delivery/Ready to Pick Up
→ Delivered/Completed, print a kitchen ticket while an order is
"Preparing", and print a receipt once it's "Out for Delivery"/"Ready to
Pick Up".

## 8. Cash on Delivery change amount

Dashboard → **SQL Editor** → New query → paste the contents of
`migrations/007_add_order_change_for.sql` → **Run**.

This adds a `change_for` column to `orders`. At checkout, a customer paying
Cash on Delivery can optionally note the bill they'll pay with (e.g.
"change for ₱500"), which then shows on the order card, kitchen ticket, and
receipt in the cashier dashboard so the rider brings the right change.

## 9. Special instructions

Dashboard → **SQL Editor** → New query → paste the contents of
`migrations/008_add_order_special_instructions.sql` → **Run**.

This adds a `special_instructions` column to `orders`. At checkout, a
customer can optionally leave a note (e.g. "extra tissue, extra spoon"),
which shows on the order card and kitchen ticket in the cashier dashboard.

## 10. ⚠️ Security fix — run this even on an already-live site

Dashboard → **SQL Editor** → New query → paste the contents of
`migrations/009_lock_down_order_writes.sql` → **Run**.

This closes a real vulnerability: `orders` previously let a signed-in
customer INSERT/UPDATE their own order rows directly from the browser
(the anon key + RLS only checked `auth.uid() = user_id`, with no check on
*which* fields changed or that a payment actually happened). That meant
anyone could fabricate an order at any price, or mark it "paid"/"delivered"
themselves, with a raw REST call — completely bypassing checkout and GCash
verification. Order creation and status/stage changes now go through
server API routes instead, so this migration is safe to run any time —
existing orders and reading your own orders are unaffected, only the old
client-writable policies are removed.

**Run this one as soon as possible if this site has already been deployed
with real orders**, since until it's applied the vulnerability above stays
open in your live database regardless of what code is deployed.

## 11. Admin/cashier login lockout

Dashboard → **SQL Editor** → New query → paste the contents of
`migrations/010_add_login_lockout.sql` → **Run**.

Adds failed-attempt tracking to `admins` and `staff`: after 5 wrong
passwords in a row against the same account, that account is locked for 15
minutes. No Vercel configuration needed.
