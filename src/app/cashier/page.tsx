import { redirect } from "next/navigation";

// /cashier now has two dashboard pages (Orders and End of Day) under the
// (dashboard) route group; this bare path just lands somewhere sensible —
// kept because the login page (and anything else) still points here.
export default function CashierRootPage() {
  redirect("/cashier/orders");
}
