"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/CartContext";
import { formatPrice } from "@/lib/menu-data";

type Status = "checking" | "succeeded" | "failed" | "pending" | "error";

function ReturnContent() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const [status, setStatus] = useState<Status>("checking");
  const [orderSummary, setOrderSummary] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [amount, setAmount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let id = searchParams.get("payment_intent_id") ?? searchParams.get("id");
    let clientKey =
      searchParams.get("payment_intent_client_key") ?? searchParams.get("client_key");

    if (!id || !clientKey) {
      try {
        const stored = sessionStorage.getItem("mellowday-payment");
        if (stored) {
          const parsed = JSON.parse(stored);
          id = id ?? parsed.id;
          clientKey = clientKey ?? parsed.clientKey;
        }
      } catch {
        // ignore malformed storage
      }
    }

    if (!id || !clientKey) {
      queueMicrotask(() => {
        setStatus("error");
        setErrorMessage("We couldn't find your payment reference.");
      });
      return;
    }

    fetch(`/api/checkout/status?id=${id}&client_key=${clientKey}`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not check payment status");
        return data as { status: string; amount: number; metadata: Record<string, string> };
      })
      .then((data) => {
        setAmount(data.amount / 100);
        setOrderSummary(data.metadata?.order_summary ?? "");
        setDeliveryAddress(data.metadata?.delivery_address ?? "");

        if (data.status === "succeeded") {
          setStatus("succeeded");
          sessionStorage.removeItem("mellowday-payment");
          clearCart();
        } else if (data.status === "awaiting_payment_method" || data.status === "processing") {
          setStatus("pending");
        } else {
          setStatus("failed");
        }
      })
      .catch((err) => {
        setStatus("error");
        setErrorMessage(err instanceof Error ? err.message : "Something went wrong");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-cream text-brown-900">
      <Header />
      <main className="flex flex-1 items-center justify-center px-6 py-32">
        <div className="w-full max-w-md rounded-3xl bg-white/70 p-8 text-center shadow-sm">
          {status === "checking" && (
            <>
              <h1 className="font-heading text-2xl font-bold text-brown-900">
                Confirming your payment…
              </h1>
              <p className="mt-2 text-sm text-brown-900/70">
                Just a moment, hang tight.
              </p>
            </>
          )}

          {status === "succeeded" && (
            <>
              <h1 className="font-heading text-2xl font-bold text-brown-900">
                Payment Confirmed! 🎉
              </h1>
              <p className="mt-2 text-sm text-brown-900/70">
                Your order is on its way — we&apos;ll have it ready shortly.
              </p>
              {orderSummary && (
                <pre className="mt-5 whitespace-pre-wrap rounded-2xl bg-green/20 p-4 text-left font-body text-sm text-brown-900">
                  {orderSummary}
                  {amount != null && `\nTotal: ${formatPrice(amount)}`}
                  {deliveryAddress && `\nDeliver to: ${deliveryAddress}`}
                </pre>
              )}
              <Link
                href="/"
                className="mt-6 inline-block w-full rounded-full bg-brown-900 px-6 py-3 text-sm font-bold text-cream hover:bg-brown-800"
              >
                Back to Home
              </Link>
            </>
          )}

          {status === "pending" && (
            <>
              <h1 className="font-heading text-2xl font-bold text-brown-900">
                Payment Still Processing
              </h1>
              <p className="mt-2 text-sm text-brown-900/70">
                GCash is still confirming your payment. This usually only takes a
                minute — please refresh this page shortly.
              </p>
            </>
          )}

          {(status === "failed" || status === "error") && (
            <>
              <h1 className="font-heading text-2xl font-bold text-brown-900">
                Payment Not Completed
              </h1>
              <p className="mt-2 text-sm text-brown-900/70">
                {errorMessage || "Your GCash payment wasn't completed. Your bag is still saved — you can try again."}
              </p>
              <Link
                href="/checkout"
                className="mt-6 inline-block w-full rounded-full bg-brown-900 px-6 py-3 text-sm font-bold text-cream hover:bg-brown-800"
              >
                Back to Checkout
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function CheckoutReturnPage() {
  return (
    <Suspense fallback={null}>
      <ReturnContent />
    </Suspense>
  );
}
