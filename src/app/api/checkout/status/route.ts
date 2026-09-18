import { NextResponse } from "next/server";
import { getPaymentIntent } from "@/lib/paymongo";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const clientKey = searchParams.get("client_key");

  if (!id || !clientKey) {
    return NextResponse.json(
      { error: "Missing payment reference" },
      { status: 400 },
    );
  }

  try {
    const intent = await getPaymentIntent(id, clientKey);
    return NextResponse.json(intent);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not check payment status";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
