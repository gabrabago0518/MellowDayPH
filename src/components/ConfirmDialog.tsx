"use client";

import { useCallback, useRef, useState } from "react";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
};

type PendingConfirm = ConfirmOptions;

// A styled stand-in for window.confirm — returns a Promise<boolean> just
// like the native dialog, so callers just `await confirm(...)`, but renders
// as an on-brand modal instead of the browser's own popup. Mount the
// returned `ConfirmDialog` element once anywhere in the component's JSX.
export function useConfirm() {
  const [pending, setPending] = useState<PendingConfirm | null>(null);
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions | string) => {
    const opts = typeof options === "string" ? { message: options } : options;
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
      setPending(opts);
    });
  }, []);

  const settle = (value: boolean) => {
    resolveRef.current?.(value);
    resolveRef.current = null;
    setPending(null);
  };

  const ConfirmDialog = pending ? (
    <div
      role="alertdialog"
      aria-modal="true"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-brown-900/40 px-6"
      onClick={() => settle(false)}
    >
      <div
        className="w-full max-w-sm rounded-3xl bg-cream p-6 shadow-2xl shadow-brown-900/30"
        onClick={(e) => e.stopPropagation()}
      >
        {pending.title && (
          <h2 className="font-heading text-lg font-bold text-brown-900">{pending.title}</h2>
        )}
        <p className={`text-sm text-brown-900/80 ${pending.title ? "mt-2" : ""}`}>
          {pending.message}
        </p>
        <div className="mt-5 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => settle(false)}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-brown-900/70 transition-colors hover:bg-brown-100/60"
          >
            {pending.cancelLabel ?? "Cancel"}
          </button>
          <button
            type="button"
            onClick={() => settle(true)}
            className={`rounded-full px-5 py-2.5 text-sm font-bold text-cream transition-colors ${
              pending.danger ? "bg-red-600 hover:bg-red-700" : "bg-brown-900 hover:bg-brown-800"
            }`}
          >
            {pending.confirmLabel ?? "Confirm"}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return { confirm, ConfirmDialog };
}
