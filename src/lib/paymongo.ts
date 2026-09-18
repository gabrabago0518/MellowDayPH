import "server-only";

const PAYMONGO_API = "https://api.paymongo.com/v1";

function authHeader(): string {
  const secretKey = process.env.PAYMONGO_SECRET_KEY;
  if (!secretKey) {
    throw new Error("PAYMONGO_SECRET_KEY is not set");
  }
  return `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`;
}

async function paymongoFetch<T>(path: string, init: RequestInit): Promise<T> {
  const res = await fetch(`${PAYMONGO_API}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader(),
      ...init.headers,
    },
  });

  const json = await res.json();

  if (!res.ok) {
    const message =
      json?.errors?.[0]?.detail ?? `PayMongo request failed (${res.status})`;
    throw new Error(message);
  }

  return json as T;
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
