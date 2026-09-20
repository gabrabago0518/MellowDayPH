"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { formatDate } from "@/lib/admin-format";
import { useConfirm } from "@/components/ConfirmDialog";
import { IconPlus, IconTrash } from "@/components/icons";
import type { Admin } from "@/lib/admin-types";

export default function AdminSettingsPage() {
  const { confirm, ConfirmDialog } = useConfirm();
  const [currentAdminId, setCurrentAdminId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [admins, setAdmins] = useState<Admin[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [newFullName, setNewFullName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadAdmins = async () => {
    const res = await adminFetch("/api/admin/admins");
    if (res.ok) {
      const body = await res.json();
      setAdmins(body.admins);
    } else {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Couldn't load admins.");
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await adminFetch("/api/admin/session");
        if (cancelled) return;
        if (res.ok) {
          const body = await res.json();
          setCurrentAdminId(body.id ?? null);
          setUsername(body.username ?? null);
        }
        await loadAdmins();
      } catch {
        if (!cancelled) setError("Couldn't load settings.");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const res = await adminFetch("/api/admin/admins", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName: newFullName, username: newUsername, password: newPassword }),
    });

    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setFormError(body.error || "Couldn't add admin.");
      return;
    }

    setNewFullName("");
    setNewUsername("");
    setNewPassword("");
    setFormOpen(false);
    loadAdmins();
  };

  const handleRemove = async (admin: Admin) => {
    if (!(await confirm({ message: `Remove admin account "${admin.username}"?`, danger: true }))) {
      return;
    }
    setAdmins((prev) => (prev ? prev.filter((a) => a.id !== admin.id) : prev));
    await adminFetch(`/api/admin/admins/${admin.id}`, { method: "DELETE" });
  };

  return (
    <div>
      <h1 className="font-heading text-3xl font-bold text-brown-900 sm:text-4xl">Settings</h1>
      <p className="mt-2 text-sm text-brown-900/70">Admin accounts and dashboard configuration.</p>

      <section className="mt-8 rounded-3xl bg-white/70 p-6 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-brown-900">Signed In As</h2>
        <p className="mt-2 text-sm text-brown-900/70">{username ?? "—"}</p>
      </section>

      <section className="mt-6 rounded-3xl bg-white/70 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-heading text-lg font-bold text-brown-900">Admin Accounts</h2>
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full bg-brown-900 px-4 py-2 text-sm font-semibold text-cream transition-colors hover:bg-brown-800"
          >
            <IconPlus className="h-4 w-4" />
            Add Admin
          </button>
        </div>
        <p className="mt-2 text-sm text-brown-900/70">
          Admin accounts are separate from customer accounts and log in with a username and
          password only.
        </p>

        {formOpen && (
          <form
            onSubmit={handleAddAdmin}
            className="mt-4 flex flex-wrap items-end gap-3 rounded-2xl bg-brown-100/30 p-4"
          >
            <label className="flex min-w-[160px] flex-1 flex-col gap-1.5 text-sm">
              <span className="font-semibold text-brown-900/80">Full name</span>
              <input
                type="text"
                value={newFullName}
                onChange={(e) => setNewFullName(e.target.value)}
                className="rounded-xl bg-white px-3 py-2.5 text-brown-900 outline-none"
              />
            </label>
            <label className="flex min-w-[160px] flex-1 flex-col gap-1.5 text-sm">
              <span className="font-semibold text-brown-900/80">Username</span>
              <input
                type="text"
                required
                autoComplete="off"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                className="rounded-xl bg-white px-3 py-2.5 text-brown-900 outline-none"
              />
            </label>
            <label className="flex min-w-[160px] flex-1 flex-col gap-1.5 text-sm">
              <span className="font-semibold text-brown-900/80">Password</span>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="rounded-xl bg-white px-3 py-2.5 text-brown-900 outline-none"
              />
            </label>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-brown-900 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-brown-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Adding…" : "Add"}
            </button>
            {formError && <p className="w-full text-sm text-red-700">{formError}</p>}
          </form>
        )}

        {error && <p className="mt-4 text-sm text-red-700">{error}</p>}

        {admins && (
          <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full min-w-[480px] text-left text-sm">
              <thead>
                <tr className="border-b border-brown-900/10 text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                  <th className="px-4 py-3">Username</th>
                  <th className="px-4 py-3">Full Name</th>
                  <th className="px-4 py-3">Added</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} className="border-b border-brown-900/5 last:border-0">
                    <td className="px-4 py-3 font-semibold text-brown-900">{admin.username}</td>
                    <td className="px-4 py-3 text-brown-900/70">{admin.full_name || "—"}</td>
                    <td className="px-4 py-3 text-brown-900/70">{formatDate(admin.created_at)}</td>
                    <td className="px-4 py-3 text-right">
                      {admin.id !== currentAdminId && (
                        <button
                          type="button"
                          onClick={() => handleRemove(admin)}
                          aria-label={`Remove ${admin.username}`}
                          className="rounded-full p-2 text-brown-900/50 transition-colors hover:bg-red-100 hover:text-red-700"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-3xl bg-white/70 p-6 shadow-sm">
        <h2 className="font-heading text-lg font-bold text-brown-900">Menu &amp; Store Info</h2>
        <p className="mt-2 text-sm text-brown-900/70">
          Menu items, prices, and store details are currently defined in the site&apos;s code
          rather than a database, so they aren&apos;t editable from here yet.
        </p>
      </section>
      {ConfirmDialog}
    </div>
  );
}
