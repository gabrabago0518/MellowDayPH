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
