const DEFAULT_TIMEOUT_MS = 15_000;

// A hung connection previously left the UI on "Loading…"/"Redirecting…"
// forever with no way out. Wrapping fetch with a timeout turns that into a
// clear error the user can act on (retry, check their connection).
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(input, { ...init, signal: init.signal ?? controller.signal });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("That took too long. Please check your connection and try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}
