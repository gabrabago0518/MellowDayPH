"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { useConfirm } from "@/components/ConfirmDialog";
import { IconPlus, IconTrash } from "@/components/icons";
import { MENU_CATEGORIES, formatPrice, type MenuCategory } from "@/lib/menu-data";

type AdminMenuItem = {
  id: string;
  name: string;
  price: number;
  category: MenuCategory;
  color: string;
  image: string | null;
  description: string | null;
  available: boolean;
  sort_order: number;
};

type ItemFormState = {
  name: string;
  price: string;
  category: MenuCategory;
  color: string;
  image: string;
  description: string;
};

const EMPTY_FORM: ItemFormState = {
  name: "",
  price: "",
  category: MENU_CATEGORIES[0],
  color: "#5C3A1E",
  image: "",
  description: "",
};

function ItemForm({
  initial,
  saving,
  error,
  submitLabel,
  onCancel,
  onSubmit,
}: {
  initial: ItemFormState;
  saving: boolean;
  error: string | null;
  submitLabel: string;
  onCancel?: () => void;
  onSubmit: (form: ItemFormState) => void;
}) {
  const [form, setForm] = useState(initial);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="flex flex-wrap items-end gap-3 rounded-3xl bg-white/70 p-6 shadow-sm"
    >
      <label className="flex min-w-[180px] flex-1 flex-col gap-1.5 text-sm">
        <span className="font-semibold text-brown-900/80">Name</span>
        <input
          type="text"
          required
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          className="rounded-xl bg-brown-100/40 px-3 py-2.5 text-brown-900 outline-none focus:bg-white"
        />
      </label>
      <label className="flex min-w-[110px] flex-col gap-1.5 text-sm">
        <span className="font-semibold text-brown-900/80">Price (₱)</span>
        <input
          type="number"
          required
          min={0}
          step={1}
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          className="rounded-xl bg-brown-100/40 px-3 py-2.5 text-brown-900 outline-none focus:bg-white"
        />
      </label>
      <label className="flex min-w-[160px] flex-col gap-1.5 text-sm">
        <span className="font-semibold text-brown-900/80">Category</span>
        <select
          value={form.category}
          onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as MenuCategory }))}
          className="rounded-xl bg-brown-100/40 px-3 py-2.5 text-brown-900 outline-none focus:bg-white"
        >
          {MENU_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="flex min-w-[110px] flex-col gap-1.5 text-sm">
        <span className="font-semibold text-brown-900/80">Color</span>
        <input
          type="color"
          value={form.color}
          onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
          className="h-[42px] w-full rounded-xl bg-brown-100/40 px-1.5 py-1"
        />
      </label>
      <label className="flex min-w-[220px] flex-1 flex-col gap-1.5 text-sm">
        <span className="font-semibold text-brown-900/80">
          Image <span className="font-normal text-brown-900/50">(optional)</span>
        </span>
        <input
          type="text"
          value={form.image}
          onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
          placeholder="/matcha-latte.png or https://…"
          className="rounded-xl bg-brown-100/40 px-3 py-2.5 text-brown-900 outline-none focus:bg-white"
        />
      </label>
      <label className="flex min-w-[220px] flex-[2] flex-col gap-1.5 text-sm">
        <span className="font-semibold text-brown-900/80">
          Description <span className="font-normal text-brown-900/50">(optional)</span>
        </span>
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          className="rounded-xl bg-brown-100/40 px-3 py-2.5 text-brown-900 outline-none focus:bg-white"
        />
      </label>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-brown-900 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-brown-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving…" : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-brown-100/60 px-5 py-2.5 text-sm font-semibold text-brown-900 hover:bg-brown-100"
          >
            Cancel
          </button>
        )}
      </div>
      {error && <p className="w-full text-sm text-red-700">{error}</p>}
    </form>
  );
}

export default function AdminMenuPage() {
  const { confirm, ConfirmDialog } = useConfirm();
  const [items, setItems] = useState<AdminMenuItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | "all">("all");
  const [addOpen, setAddOpen] = useState(false);
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);

  const load = async () => {
    const res = await adminFetch("/api/admin/menu");
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Couldn't load the menu.");
      return;
    }
    const body = await res.json();
    setItems(body.items);
  };

  useEffect(() => {
    async function initialLoad() {
      try {
        await load();
      } catch {
        setError("Couldn't load the menu.");
      }
    }
    initialLoad();
  }, []);

  const handleAdd = async (form: ItemFormState) => {
    setAddSaving(true);
    setAddError(null);
    const res = await adminFetch("/api/admin/menu", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    setAddSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setAddError(body.error || "Couldn't add the item.");
      return;
    }
    setAddOpen(false);
    load();
  };

  const handleEdit = async (id: string, form: ItemFormState) => {
    setEditSaving(true);
    setEditError(null);
    const res = await adminFetch(`/api/admin/menu/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    setEditSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setEditError(body.error || "Couldn't save changes.");
      return;
    }
    setEditingId(null);
    load();
  };

  const handleToggleAvailable = async (item: AdminMenuItem) => {
    setItems((prev) =>
      prev ? prev.map((i) => (i.id === item.id ? { ...i, available: !i.available } : i)) : prev,
    );
    const res = await adminFetch(`/api/admin/menu/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ available: !item.available }),
    });
    if (!res.ok) {
      setItems((prev) =>
        prev ? prev.map((i) => (i.id === item.id ? { ...i, available: item.available } : i)) : prev,
      );
    }
  };

  const handleDelete = async (item: AdminMenuItem) => {
    if (!(await confirm({ message: `Remove "${item.name}" from the menu?`, danger: true }))) return;
    setItems((prev) => (prev ? prev.filter((i) => i.id !== item.id) : prev));
    await adminFetch(`/api/admin/menu/${item.id}`, { method: "DELETE" });
  };

  const filteredItems = items?.filter(
    (item) => categoryFilter === "all" || item.category === categoryFilter,
  );

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-brown-900 sm:text-4xl">Menu</h1>
          <p className="mt-2 text-sm text-brown-900/70">
            Add a drink, change a price, or turn an item off when you&apos;re out of stock — changes
            show up on the site within a minute, no redeploy needed.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setAddOpen((v) => !v);
            setAddError(null);
          }}
          className="flex items-center gap-2 rounded-full bg-brown-900 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-brown-800"
        >
          <IconPlus className="h-4 w-4" />
          Add Item
        </button>
      </div>

      {addOpen && (
        <div className="mt-6">
          <ItemForm
            initial={EMPTY_FORM}
            saving={addSaving}
            error={addError}
            submitLabel="Add"
            onCancel={() => setAddOpen(false)}
            onSubmit={handleAdd}
          />
        </div>
      )}

      <div className="mt-6">
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as MenuCategory | "all")}
          className="rounded-full bg-white/70 px-4 py-2 text-sm text-brown-900 outline-none focus:bg-white"
        >
          <option value="all">All categories</option>
          {MENU_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="mt-10 rounded-3xl bg-white/70 p-8 text-center shadow-sm">
          <p className="text-sm text-brown-900/70">{error}</p>
        </div>
      )}

      {!items && !error && <p className="mt-10 text-sm text-brown-900/60">Loading…</p>}

      {filteredItems && (
        <div className="mt-4 flex flex-col gap-3">
          {filteredItems.map((item) =>
            editingId === item.id ? (
              <ItemForm
                key={item.id}
                initial={{
                  name: item.name,
                  price: String(item.price),
                  category: item.category,
                  color: item.color,
                  image: item.image ?? "",
                  description: item.description ?? "",
                }}
                saving={editSaving}
                error={editError}
                submitLabel="Save"
                onCancel={() => {
                  setEditingId(null);
                  setEditError(null);
                }}
                onSubmit={(form) => handleEdit(item.id, form)}
              />
            ) : (
              <div
                key={item.id}
                className="flex flex-wrap items-center gap-4 rounded-3xl bg-white/70 p-4 shadow-sm"
              >
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brown-100/40">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element -- arbitrary admin-entered path/URL, not a build-time-known asset
                    <img src={item.image} alt="" className="h-full w-full rounded-xl object-contain p-1" />
                  ) : (
                    <span className="h-6 w-6 rounded-full" style={{ backgroundColor: item.color }} />
                  )}
                </div>
                <div className="min-w-[160px] flex-1">
                  <p className="font-semibold text-brown-900">{item.name}</p>
                  <p className="text-xs text-brown-900/60">{item.category}</p>
                </div>
                <p className="w-20 shrink-0 text-right font-bold text-brown-900">
                  {formatPrice(item.price)}
                </p>
                <button
                  type="button"
                  onClick={() => handleToggleAvailable(item)}
                  className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold ${
                    item.available ? "bg-green/40 text-brown-900" : "bg-brown-100 text-brown-900/60"
                  }`}
                >
                  {item.available ? "Available" : "Unavailable"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(item.id);
                    setEditError(null);
                  }}
                  className="shrink-0 rounded-full bg-brown-100/60 px-4 py-2 text-xs font-bold text-brown-900 hover:bg-brown-100"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(item)}
                  aria-label={`Remove ${item.name}`}
                  className="shrink-0 rounded-full p-2 text-brown-900/50 transition-colors hover:bg-red-100 hover:text-red-700"
                >
                  <IconTrash className="h-4 w-4" />
                </button>
              </div>
            ),
          )}
          {filteredItems.length === 0 && (
            <div className="rounded-3xl bg-white/70 p-10 text-center shadow-sm">
              <p className="text-sm text-brown-900/60">No items in this category yet.</p>
            </div>
          )}
        </div>
      )}
      {ConfirmDialog}
    </div>
  );
}
