import "server-only";
import { flagAbuse } from "./abuse-alert";
import { getSupabaseAdmin, isAdminConfigured } from "./supabase-admin";

const MAX_MESSAGE_LENGTH = 2000;
const MAX_STACK_LENGTH = 8000;

export type LogErrorInput = {
  source: "server" | "client";
  route?: string;
  message: string;
  stack?: string;
  context?: Record<string, unknown>;
  // Server-side errors (a broken checkout, a failed order write) page the
  // configured webhook; client-side render errors are still recorded and
  // visible in the admin Errors tab, but don't page by default — a stray
  // browser-extension conflict on one visitor's screen isn't the same
  // urgency as the payment path actually breaking.
  alert?: boolean;
};

// Best-effort: logging an error must never itself throw and mask the
// original failure, so every path here is wrapped and swallows its own
// errors after a console.error fallback.
export async function logError(input: LogErrorInput): Promise<void> {
  const { source, route, message, stack, context, alert = source === "server" } = input;

  try {
    if (isAdminConfigured) {
      await getSupabaseAdmin()
        .from("error_logs")
        .insert({
          source,
          route: route ?? null,
          message: message.slice(0, MAX_MESSAGE_LENGTH),
          stack: stack ? stack.slice(0, MAX_STACK_LENGTH) : null,
          context: context ?? null,
        });
    }
  } catch (err) {
    console.error("[error-log] failed to persist error log:", err);
  }

  if (alert) {
    const key = `error:${source}:${route ?? "unknown"}`;
    await flagAbuse(key, `${source} error on ${route ?? "unknown route"}: ${message}`);
  } else {
    console.error(`[${source} error]${route ? ` ${route}:` : ""} ${message}`);
  }
}
