import "server-only";

const ALERT_COOLDOWN_MS = 30 * 60_000;
const MAX_TRACKED_ALERTS = 2000;

// One cooldown timestamp per alert key, so a sustained attack that trips
// the same alert thousands of times in a row still only pages/logs once
// every 30 minutes instead of flooding the log (or a webhook) as fast as
// the attacker can send requests.
const recentAlerts = new Map<string, number>();

// Best-effort abnormal-usage alert. Always logs to the server console
// (visible in Vercel's function logs, which you can wire to Vercel's own
// alerting or a log drain for free). If ALERT_WEBHOOK_URL is set, it also
// posts to it — any Slack or Discord "Incoming Webhook" URL works with
// this payload shape, and both are free to create. Nothing here is a paid
// dependency: this fires zero extra API calls unless you opt in.
export async function flagAbuse(key: string, message: string): Promise<void> {
  const now = Date.now();
  const last = recentAlerts.get(key);
  if (last && now - last < ALERT_COOLDOWN_MS) return;

  if (recentAlerts.size >= MAX_TRACKED_ALERTS) {
    recentAlerts.clear();
  }
  recentAlerts.set(key, now);

  console.error(`[ABUSE ALERT] ${message}`);

  const webhookUrl = process.env.ALERT_WEBHOOK_URL;
  if (!webhookUrl) return;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const text = `Mellow Day PH — abnormal API usage: ${message}`;
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // "content" is what Discord webhooks read; "text" is what Slack
      // webhooks read. Sending both keeps this working for either without
      // needing to know in advance which one you use.
      body: JSON.stringify({ content: text, text }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeout));
  } catch {
    // Never let a failed alert delivery break the request that triggered it.
  }
}
