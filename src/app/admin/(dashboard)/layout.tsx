"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { useAuth } from "@/lib/AuthContext";
import { supabase } from "@/lib/supabase";

type GateState =
  | "loading"
  | "unauthenticated"
  | "token-rejected"
  | "unauthorized"
  | "not-configured"
  | "error"
  | "ready";

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

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { loading: authLoading, user, signOut } = useAuth();
  const [state, setState] = useState<GateState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (authLoading) return;

    if (!supabase) {
      queueMicrotask(() => setState("unauthenticated"));
      return;
    }

    let cancelled = false;

    async function check() {
      // Read the session directly from the SDK rather than the AuthContext's
      // `user` — right after a fresh login via router.push, that context can
      // briefly still reflect the pre-login state, incorrectly bouncing an
      // already-authenticated visitor back to /login.
      const { data: sessionData } = await supabase!.auth.getSession();
      const token = sessionData.session?.access_token;
      if (!token) {
        if (!cancelled) setState("unauthenticated");
        return;
      }

      const res = await fetch("/api/admin/session", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (cancelled) return;

      if (res.status === 401) {
        // We had a token client-side but the server rejected it — this is
        // different from "never logged in" and looping back to /admin/login
        // would just be confusing, so surface it instead.
        const body = await res.json().catch(() => ({}));
        setErrorMessage(body.error || "Session rejected by the server.");
        setState("token-rejected");
        return;
      }
      if (res.status === 403) {
        setState("unauthorized");
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

      setState("ready");
    }

    check();
    return () => {
      cancelled = true;
    };
  }, [authLoading]);

  useEffect(() => {
    if (state === "unauthenticated") router.replace("/admin/login");
  }, [state, router]);

  const handleLogout = async () => {
    await signOut();
    router.replace("/admin/login");
  };

  if (state === "loading" || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <p className="text-sm text-brown-900/60">Loading…</p>
      </div>
    );
  }

  if (state === "unauthenticated") return null;

  if (state === "token-rejected") {
    return (
      <CenteredMessage
        title="Session Not Recognized"
        body={
          <>
            You&apos;re logged in, but the server rejected your session:{" "}
            <strong>{errorMessage}</strong>. Try logging out and back in — if
            this keeps happening, the site&apos;s admin configuration needs a
            look.
          </>
        }
      />
    );
  }

  if (state === "unauthorized") {
    return (
      <CenteredMessage
        title="Not Authorized"
        body="Your account isn't on the admin list for this site."
      />
    );
  }

  if (state === "not-configured") {
    return (
      <CenteredMessage
        title="Admin Dashboard Not Configured"
        body="This site's admin dashboard hasn't been set up yet."
      />
    );
  }

  if (state === "error") {
    return <CenteredMessage title="Couldn't Load Dashboard" body={errorMessage} />;
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown-900 md:flex-row">
      <AdminSidebar email={user?.email} onLogout={handleLogout} />
      <main className="flex-1 px-6 py-8 md:px-10 md:py-12">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
