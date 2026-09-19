"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/adminApi";
import { formatDate } from "@/lib/admin-format";
import { IconPlus, IconTrash } from "@/components/icons";
import type { Employee } from "@/lib/admin-types";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<Employee[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Barista");
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await adminFetch("/api/admin/employees");
        if (cancelled) return;
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          setError(body.error || "Couldn't load employees.");
          return;
        }
        const body = await res.json();
        setEmployees(body.staff);
      } catch {
        if (!cancelled) setError("Couldn't load employees.");
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const refresh = async () => {
    const res = await adminFetch("/api/admin/employees");
    if (res.ok) {
      const body = await res.json();
      setEmployees(body.staff);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFormError(null);

    const res = await adminFetch("/api/admin/employees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, role }),
    });

    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setFormError(body.error || "Couldn't add employee.");
      return;
    }

    setFullName("");
    setEmail("");
    setRole("Barista");
    setFormOpen(false);
    refresh();
  };

  const handleToggleStatus = async (employee: Employee) => {
    const nextStatus = employee.status === "active" ? "inactive" : "active";
    setEmployees((prev) =>
      prev ? prev.map((e) => (e.id === employee.id ? { ...e, status: nextStatus } : e)) : prev,
    );
    await adminFetch(`/api/admin/employees/${employee.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
  };

  const handleRemove = async (employee: Employee) => {
    if (!confirm(`Remove ${employee.full_name} from the staff list?`)) return;
    setEmployees((prev) => (prev ? prev.filter((e) => e.id !== employee.id) : prev));
    await adminFetch(`/api/admin/employees/${employee.id}`, { method: "DELETE" });
  };

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-brown-900 sm:text-4xl">
            Employees
          </h1>
          <p className="mt-2 text-sm text-brown-900/70">Staff who work at Mellow Day PH.</p>
        </div>
        <button
          type="button"
          onClick={() => setFormOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full bg-brown-900 px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-brown-800"
        >
          <IconPlus className="h-4 w-4" />
          Add Employee
        </button>
      </div>

      {formOpen && (
        <form
          onSubmit={handleAdd}
          className="mt-6 flex flex-wrap items-end gap-3 rounded-3xl bg-white/70 p-6 shadow-sm"
        >
          <label className="flex flex-1 min-w-[160px] flex-col gap-1.5 text-sm">
            <span className="font-semibold text-brown-900/80">Full name</span>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-xl bg-brown-100/40 px-3 py-2.5 text-brown-900 outline-none focus:bg-white"
            />
          </label>
          <label className="flex flex-1 min-w-[200px] flex-col gap-1.5 text-sm">
            <span className="font-semibold text-brown-900/80">Email</span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl bg-brown-100/40 px-3 py-2.5 text-brown-900 outline-none focus:bg-white"
            />
          </label>
          <label className="flex min-w-[140px] flex-col gap-1.5 text-sm">
            <span className="font-semibold text-brown-900/80">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="rounded-xl bg-brown-100/40 px-3 py-2.5 text-brown-900 outline-none focus:bg-white"
            >
              <option>Manager</option>
              <option>Barista</option>
              <option>Cashier</option>
              <option>Staff</option>
            </select>
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

      {error && (
        <div className="mt-10 rounded-3xl bg-white/70 p-8 text-center shadow-sm">
          <p className="text-sm text-brown-900/70">{error}</p>
        </div>
      )}

      {!employees && !error && <p className="mt-10 text-sm text-brown-900/60">Loading…</p>}

      {employees && (
        <div className="mt-6 overflow-x-auto rounded-3xl bg-white/70 shadow-sm">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-brown-900/10 text-xs font-semibold uppercase tracking-wide text-brown-900/50">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Added</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((employee) => (
                <tr key={employee.id} className="border-b border-brown-900/5 last:border-0">
                  <td className="px-4 py-3 font-semibold text-brown-900">{employee.full_name}</td>
                  <td className="px-4 py-3 text-brown-900/70">{employee.email}</td>
                  <td className="px-4 py-3 text-brown-900/70">{employee.role}</td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(employee)}
                      className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                        employee.status === "active"
                          ? "bg-green/40 text-brown-900"
                          : "bg-brown-100 text-brown-900/60"
                      }`}
                    >
                      {employee.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-brown-900/70">{formatDate(employee.created_at)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleRemove(employee)}
                      aria-label={`Remove ${employee.full_name}`}
                      className="rounded-full p-2 text-brown-900/50 transition-colors hover:bg-red-100 hover:text-red-700"
                    >
                      <IconTrash className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-brown-900/60">
                    No employees added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
