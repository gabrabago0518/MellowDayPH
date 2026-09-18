"use client";

import { useEffect, useState } from "react";
import { useCart } from "@/lib/CartContext";

export default function CartToast() {
  const { toast } = useCart();
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    queueMicrotask(() => setMessage(toast));
  }, [toast]);

  return (
    <div
      aria-live="polite"
      className={`pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center transition-all duration-300 ${
        toast ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {message && (
        <div className="flex items-center gap-2 rounded-full bg-brown-900 px-5 py-3 text-sm font-semibold text-cream shadow-lg shadow-brown-900/30">
          <span aria-hidden>✓</span> {message}
        </div>
      )}
    </div>
  );
}
