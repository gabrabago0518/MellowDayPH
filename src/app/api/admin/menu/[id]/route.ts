import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { MENU_CATEGORIES } from "@/lib/menu-data";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const MAX_ITEM_PRICE_PESOS = 10_000;

function parsePartialItemInput(body: unknown): { error: string } | Record<string, unknown> {
  const b = (body ?? {}) as Record<string, unknown>;
  const update: Record<string, unknown> = {};

  if (b.name !== undefined) {
    const name = typeof b.name === "string" ? b.name.trim() : "";
    if (!name) return { error: "Name can't be empty." };
    if (name.length > 100) return { error: "Name is too long." };
    update.name = name;
  }
  if (b.price !== undefined) {
    const price = Number(b.price);
    if (!Number.isFinite(price) || price < 0 || !Number.isInteger(price)) {
      return { error: "Price must be a whole number of pesos." };
    }
    if (price > MAX_ITEM_PRICE_PESOS) {
      return { error: `Price can't exceed ₱${MAX_ITEM_PRICE_PESOS.toLocaleString()}.` };
    }
    update.price = price;
  }
  if (b.category !== undefined) {
    if (!MENU_CATEGORIES.includes(b.category as (typeof MENU_CATEGORIES)[number])) {
      return { error: "Choose a valid category." };
    }
    update.category = b.category;
  }
  if (b.color !== undefined) {
    if (typeof b.color !== "string" || !/^#[0-9a-fA-F]{6}$/.test(b.color)) {
      return { error: "Color must be a hex value like #5C3A1E." };
    }
    update.color = b.color;
  }
  if (b.image !== undefined) {
    const image = typeof b.image === "string" ? b.image.trim() : "";
    if (image && !(image.startsWith("/") || image.startsWith("https://"))) {
      return { error: "Image must be a site path (starting with /) or an https:// URL." };
    }
    update.image = image || null;
  }
  if (b.description !== undefined) {
    const description = typeof b.description === "string" ? b.description.trim().slice(0, 300) : "";
    update.description = description || null;
  }
  if (b.available !== undefined) {
    if (typeof b.available !== "boolean") return { error: "available must be true or false." };
    update.available = b.available;
  }
  if (b.sortOrder !== undefined) {
    const sortOrder = Number(b.sortOrder);
    if (!Number.isFinite(sortOrder)) return { error: "sortOrder must be a number." };
    update.sort_order = sortOrder;
  }

  return update;
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const update = parsePartialItemInput(body);
  if ("error" in update) {
    return NextResponse.json({ error: update.error }, { status: 400 });
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("menu_items")
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id, name, price, category, color, image, description, available, sort_order")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/menu");
  revalidatePath("/");

  return NextResponse.json({ item: data });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const { id } = await params;
  const { error } = await getSupabaseAdmin().from("menu_items").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  revalidatePath("/menu");
  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
