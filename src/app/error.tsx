"use client";

import { useEffect } from "react";
import Link from "next/link";
import CartModal from "@/components/CartModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown-900">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-32 text-center">
        <div>
          <h1 className="font-heading text-2xl font-bold text-brown-900 sm:text-3xl">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-brown-900/70">Sorry about that — please try again.</p>
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-full bg-brown-900 px-6 py-3 text-sm font-bold text-cream hover:bg-brown-800"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="text-sm font-semibold text-brown-900/70 hover:text-brown-900"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <CartModal />
    </div>
  );
}
