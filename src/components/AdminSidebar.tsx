"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import {
  IconBadge,
  IconGear,
  IconGrid,
  IconLogout,
  IconReceipt,
  IconUsers,
} from "./icons";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: IconGrid, exact: true },
  { href: "/admin/orders", label: "Orders", icon: IconReceipt, exact: false },
  { href: "/admin/customers", label: "Customers", icon: IconUsers, exact: false },
  { href: "/admin/employees", label: "Employees", icon: IconBadge, exact: false },
  { href: "/admin/settings", label: "Settings", icon: IconGear, exact: false },
];

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <>
      {NAV_ITEMS.map((item) => {
        const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors ${
              active ? "bg-brown-900 text-cream" : "text-brown-900/70 hover:bg-brown-100/60"
            }`}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

export default function AdminSidebar({
  email,
  onLogout,
}: {
  email?: string | null;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-brown-900/10 bg-white/60 px-4 py-6 md:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-2">
          <Logo className="h-9 w-9" />
          <span className="font-heading text-base font-bold text-brown-900">
            Mellow Day Admin
          </span>
        </Link>

        <nav className="mt-8 flex flex-1 flex-col gap-1">
          <NavLinks pathname={pathname} />
        </nav>

        <div className="border-t border-brown-900/10 pt-4">
          {email && <p className="truncate px-2 text-xs text-brown-900/50">{email}</p>}
          <button
            type="button"
            onClick={onLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-brown-900/70 transition-colors hover:bg-brown-100/60"
          >
            <IconLogout className="h-5 w-5 shrink-0" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <nav className="flex items-center gap-1 overflow-x-auto border-b border-brown-900/10 bg-white/60 px-3 py-2 md:hidden">
        {NAV_ITEMS.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                active ? "bg-brown-900 text-cream" : "text-brown-900/70 hover:bg-brown-100/60"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={onLogout}
          className="ml-auto flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-brown-900/70 hover:bg-brown-100/60"
        >
          <IconLogout className="h-4 w-4 shrink-0" />
          Log Out
        </button>
      </nav>
    </>
  );
}
