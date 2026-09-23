import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { MENU_CATEGORIES } from "@/lib/menu-data";
import { getAllMenuItemsForAdmin } from "@/lib/menu-items";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const MAX_ITEM_PRICE_PESOS = 10_000;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function parseItemInput(body: unknown) {
  const b = (body ?? {}) as Record<string, unknown>;
  const name = typeof b.name === "string" ? b.name.trim() : "";
  const price = Number(b.price);
  const category = typeof b.category === "string" ? b.category : "";
  const color = typeof b.color === "string" && /^#[0-9a-fA-F]{6}$/.test(b.color) ? b.color : "#5C3A1E";
  const image = typeof b.image === "string" ? b.image.trim() : "";
  const description = typeof b.description === "string" ? b.description.trim().slice(0, 300) : "";
  const available = typeof b.available === "boolean" ? b.available : true;

  if (!name) return { error: "Name is required." };
  if (name.length > 100) return { error: "Name is too long." };
  if (!Number.isFinite(price) || price < 0 || !Number.isInteger(price)) {
    return { error: "Price must be a whole number of pesos." };
  }
  if (price > MAX_ITEM_PRICE_PESOS) {
    return { error: `Price can't exceed ₱${MAX_ITEM_PRICE_PESOS.toLocaleString()}.` };
  }
  if (!MENU_CATEGORIES.includes(category as (typeof MENU_CATEGORIES)[number])) {
    return { error: "Choose a valid category." };
  }
  if (image && !(image.startsWith("/") || image.startsWith("https://"))) {
    return { error: "Image must be a site path (starting with /) or an https:// URL." };
  }

  return { name, price, category, color, image: image || null, description: description || null, available };
}

export async function GET(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const items = await getAllMenuItemsForAdmin();
    return NextResponse.json({ items });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Couldn't load the menu.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await verifyAdmin(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const body = await request.json().catch(() => null);
  const parsed = parseItemInput(body);
  if ("error" in parsed) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const supabaseAdmin = getSupabaseAdmin();

  // New items sort after every existing item in the same category by
  // default — nothing to configure, and the admin can still edit
  // sort_order afterward to reorder.
  const { data: last } = await supabaseAdmin
    .from("menu_items")
    .select("sort_order")
    .eq("category", parsed.category)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const sortOrder = (last?.sort_order ?? -10) + 10;

  const baseId = slugify(`${parsed.category}-${parsed.name}`);
  let id = baseId;
  let attempt = 0;

  // Handles the (rare) case of two items slugifying to the same id, e.g.
  // "Iced Latte" added twice — retries with a numeric suffix rather than
  // failing outright, since the admin adding it has no reason to expect
  // an internal id collision to be their problem to solve.
  for (;;) {
    const { error } = await supabaseAdmin.from("menu_items").insert({
      id,
      name: parsed.name,
      price: parsed.price,
      category: parsed.category,
      color: parsed.color,
      image: parsed.image,
      description: parsed.description,
      available: parsed.available,
      sort_order: sortOrder,
    });

    if (!error) break;
    if (error.code === "23505" && attempt < 5) {
      attempt++;
      id = `${baseId}-${attempt}`;
      continue;
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data: created, error: fetchError } = await supabaseAdmin
    .from("menu_items")
    .select("id, name, price, category, color, image, description, available, sort_order")
    .eq("id", id)
    .single();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }

  revalidatePath("/menu");
  revalidatePath("/");

  return NextResponse.json({ item: created }, { status: 201 });
}
