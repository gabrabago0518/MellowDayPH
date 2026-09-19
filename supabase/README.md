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

In Vercel → Project Settings → Environment Variables, add:

- `SUPABASE_SERVICE_ROLE_KEY` (type: **Secret**) — Supabase dashboard →
  Settings → API → "Secret keys". Server-only; never exposed to the browser.
- `ADMIN_EMAILS` (type: **Config**) — comma-separated email(s) allowed to
  view `/admin`.

Vercel env var changes only apply to deployments created *after* they're
saved — the currently-live deployment won't pick them up on its own. After
saving both, trigger a new deployment (Deployments tab → the latest one's
**⋯** menu → Redeploy, or just push any commit to `main`) and confirm its
Production entry shows a timestamp *after* you saved the variables.

## 4. Employees tab (/admin/employees)

Dashboard → **SQL Editor** → New query → paste the contents of
`migrations/002_create_staff.sql` → **Run**.

This creates the `staff` table the Employees tab reads and writes. It's
only ever accessed through the service-role admin API, so no further
Vercel configuration is needed beyond step 3 above.
