"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/lib/supabase";

type Status = "checking" | "confirmed" | "error";

function ConfirmContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<Status>("checking");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!supabase) {
      queueMicrotask(() => {
        setStatus("error");
        setErrorMessage("Accounts aren't set up on this site yet.");
      });
      return;
    }

    const code = searchParams.get("code");

    async function confirm() {
      if (code) {
        const { error } = await supabase!.auth.exchangeCodeForSession(code);
        if (error) {
          setStatus("error");
          setErrorMessage(error.message);
          return;
        }
        setStatus("confirmed");
        return;
      }

      // Older / implicit-flow links carry the session in the URL hash,
      // which supabase-js already parses on load — just check for it.
      const { data, error } = await supabase!.auth.getSession();
      if (error || !data.session) {
        setStatus("error");
        setErrorMessage(
          error?.message || "This confirmation link is invalid or has expired.",
        );
        return;
      }
      setStatus("confirmed");
    }

    confirm();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown-900">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-32">
        <div className="w-full max-w-sm rounded-3xl bg-white/70 p-8 text-center shadow-sm">
          {status === "checking" && (
            <>
              <h1 className="font-heading text-2xl font-bold text-brown-900">
                Confirming your email…
              </h1>
              <p className="mt-2 text-sm text-brown-900/70">Just a moment.</p>
            </>
          )}

          {status === "confirmed" && (
            <>
              <h1 className="font-heading text-2xl font-bold text-brown-900">
                You&apos;re all set! 🎉
              </h1>
              <p className="mt-2 text-sm text-brown-900/70">
                Your email is confirmed and you&apos;re logged in.
              </p>
              <Link
                href="/menu"
                className="mt-6 inline-block w-full rounded-full bg-brown-900 px-6 py-3 text-sm font-bold text-cream hover:bg-brown-800"
              >
                Start Ordering
              </Link>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="font-heading text-2xl font-bold text-brown-900">
                Confirmation Failed
              </h1>
              <p className="mt-2 text-sm text-brown-900/70">{errorMessage}</p>
              <Link
                href="/login"
                className="mt-6 inline-block w-full rounded-full bg-brown-900 px-6 py-3 text-sm font-bold text-cream hover:bg-brown-800"
              >
                Back to Log In
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense fallback={null}>
      <ConfirmContent />
    </Suspense>
  );
}
