import "server-only";

// The store operates in the Philippines, so "today" for daily stats and
// cash reconciliation follows Asia/Manila local time rather than the
// server's (UTC) clock — otherwise an order or a closing near midnight
// would land on the wrong day.
const phDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Manila",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function phDateKey(date: Date): string {
  return phDateFormatter.format(date);
}
