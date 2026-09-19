"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { useAuth } from "@/lib/AuthContext";

export default function AdminHeader() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    router.replace("/admin/login");
  };

  return (
    <header className="border-b border-white/10 bg-[#1c1410]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/admin" className="flex items-center gap-3">
          <Logo className="h-10 w-10" />
          <span className="font-heading text-lg font-bold text-cream">
            Mellow Day Admin
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {user?.email && (
            <span className="hidden text-sm text-cream/50 sm:inline">{user.email}</span>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-white/20"
          >
            Log Out
          </button>
        </div>
      </div>
    </header>
  );
}
