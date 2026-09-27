"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import CashierSidebar from "@/components/CashierSidebar";
import { useConfirm } from "@/components/ConfirmDialog";
import { cashierFetch } from "@/lib/cashierApi";

type GateState = "loading" | "unauthenticated" | "not-configured" | "error" | "ready";

function CenteredMessage({ title, body }: { title: string; body: ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 text-center shadow-sm">
        <h1 className="font-heading text-xl font-bold text-brown-900">{title}</h1>
        <p className="mt-2 text-sm text-brown-900/70">{body}</p>
      </div>
    </div>
  );
}

export default function CashierDashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<GateState>("loading");
  const [username, setUsername] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const { confirm, ConfirmDialog } = useConfirm();

  useEffect(() => {
    let cancelled = false;

    async function check() {
      try {
        const res = await cashierFetch("/api/cashier/session");
        if (cancelled) return;

        if (res.status === 401) {
          setState("unauthenticated");
          return;
        }
        if (res.status === 503) {
          setState("not-configured");
          return;
        }
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setErrorMessage(body.error || "Something went wrong.");
          setState("error");
          return;
        }

        const body = await res.json();
        setUsername(body.username ?? null);
        setState("ready");
      } catch {
        if (!cancelled) {
          setErrorMessage("Couldn't reach the server.");
          setState("error");
        }
      }
    }

    check();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (state === "unauthenticated") router.replace("/cashier/login");
  }, [state, router]);

  const handleLogout = async () => {
    if (!(await confirm("Log out of the cashier dashboard?"))) return;
    await cashierFetch("/api/cashier/auth/logout", { method: "POST" });
    router.replace("/cashier/login");
  };

  if (state === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm text-brown-900/60">Loading…</p>
      </div>
    );
  }

  if (state === "unauthenticated") return null;

  if (state === "not-configured") {
    return (
      <CenteredMessage
        title="Cashier Dashboard Not Configured"
        body="This site's cashier dashboard hasn't been set up yet."
      />
    );
  }

  if (state === "error") {
    return <CenteredMessage title="Couldn't Load" body={errorMessage} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown-900 md:flex-row">
      <CashierSidebar username={username} onLogout={handleLogout} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
      {ConfirmDialog}
    </div>
  );
}
