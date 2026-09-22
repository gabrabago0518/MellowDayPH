import "server-only";

const PAYMONGO_API = "https://api.paymongo.com/v1";

// Bounded retry: at most this many attempts total (the initial try plus
// retries), each with its own timeout — never an unbounded/while-true
// retry loop. Retries only fire for failures that mean our request likely
// never reached PayMongo (network error, timeout) or that PayMongo itself
// flagged as transient (429 rate limited, 5xx). A 4xx like "bad request"
// or "invalid API key" is never retried — retrying it would just burn
// another call for the same guaranteed failure. These calls run before
// the customer ever authorizes anything on GCash's side, so a retried
// "create" can't cause a double charge; worst case on a rare double
// timeout is one unused, never-paid PayMongo object.
const MAX_ATTEMPTS = 2;
const REQUEST_TIMEOUT_MS = 8_000;
const RETRY_BASE_DELAY_MS = 400;

function authHeader(): string {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;
  if (!secretKey) {
    throw new Error("PAYMONGO_SECRET_KEY is not set");
  }
  return `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
}

function isRetryableStatus(status: number): boolean {
  return status === 429 || (status >= 500 && status < 600);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function paymongoFetch<T>(path: string, init: RequestInit): Promise<T> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(`${PAYMONGO_API}${path}`, {
        ...init,
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader(),
          ...init.headers,
        },
        signal: controller.signal,
      });
    } catch (err) {
      const timedOut = err instanceof DOMException && err.name === "AbortError";
      if (attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_BASE_DELAY_MS * attempt);
        continue;
      }
      throw new Error(
        timedOut ? "PayMongo took too long to respond. Please try again." : "Could not reach PayMongo. Please try again.",
      );
    } finally {
      clearTimeout(timeout);
    }

    const json = await res.json().catch(() => null);

    if (!res.ok) {
      const message = json?.errors?.[0]?.detail ?? `PayMongo request failed (${res.status})`;
      if (isRetryableStatus(res.status) && attempt < MAX_ATTEMPTS) {
        await sleep(RETRY_BASE_DELAY_MS * attempt);
        continue;
      }
      throw new Error(message);
    }

    return json as T;
  }

  // Unreachable — the loop above always returns or throws — but keeps
  // TypeScript happy about every code path returning a value.
  throw new Error("PayMongo request failed.");
}

type PaymongoResource<TAttrs> = {
  data: {
    id: string;
    attributes: TAttrs;
  };
};

type PaymentIntentAttributes = {
  status: string;
  client_key: string;
  amount: number;
  currency: string;
  next_action?: {
    type: string;
    redirect?: { url: string; return_url: string };
  };
  metadata?: Record<string, string>;
};

export type GCashCheckout = {
  paymentIntentId: string;
  clientKey: string;
  checkoutUrl: string;
};

export async function createGCashCheckout(params: {
  amountCentavos: number;
  description: string;
  metadata: Record<string, string>;
  billing: { name: string; phone: string; email?: string };
  returnUrl: string;
}): Promise<GCashCheckout> {
  const { amountCentavos, description, metadata, billing, returnUrl } = params;

  const intent = await paymongoFetch<PaymongoResource<PaymentIntentAttributes>>(
    "/payment_intents",
    {
      method: "POST",
      body: JSON.stringify({
        data: {
          attributes: {
            amount: amountCentavos,
            currency: "PHP",
            payment_method_allowed: ["gcash"],
            capture_type: "automatic",
            description,
            metadata,
          },
        },
      }),
    },
  );

  const paymentMethod = await paymongoFetch<PaymongoResource<{ type: string }>>(
    "/payment_methods",
    {
      method: "POST",
      body: JSON.stringify({
        data: {
          attributes: {
            type: "gcash",
            billing: {
              name: billing.name,
              phone: billing.phone,
              email: billing.email || undefined,
            },
          },
        },
      }),
    },
  );

  const attached = await paymongoFetch<PaymongoResource<PaymentIntentAttributes>>(
    `/payment_intents/${intent.data.id}/attach`,
    {
      method: "POST",
      body: JSON.stringify({
        data: {
          attributes: {
            payment_method: paymentMethod.data.id,
            client_key: intent.data.attributes.client_key,
            return_url: returnUrl,
          },
        },
      }),
    },
  );

  const checkoutUrl = attached.data.attributes.next_action?.redirect?.url;
  if (!checkoutUrl) {
    throw new Error("PayMongo did not return a GCash checkout URL");
  }

  return {
    paymentIntentId: attached.data.id,
    clientKey: attached.data.attributes.client_key,
    checkoutUrl,
  };
}

export type PaymentIntentStatus = {
  status: string;
  amount: number;
  metadata: Record<string, string>;
};

export async function getPaymentIntent(
  id: string,
  clientKey: string,
): Promise<PaymentIntentStatus> {
  const intent = await paymongoFetch<PaymongoResource<PaymentIntentAttributes>>(
    `/payment_intents/${id}?client_key=${encodeURIComponent(clientKey)}`,
    { method: "GET" },
  );

  return {
    status: intent.data.attributes.status,
    amount: intent.data.attributes.amount,
    metadata: intent.data.attributes.metadata ?? {},
  };
}
