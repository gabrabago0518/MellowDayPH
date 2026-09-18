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
