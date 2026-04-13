"use client";

import { useState, useEffect } from "react";
import AdminWrapper from "@/components/AdminWrapper";
import { Trash2, Users, UserCheck, UserX } from "lucide-react";

interface Subscriber {
  id: string; email: string; subscribedAt: string; active: boolean;
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  useEffect(() => {
    fetch("/api/admin/subscribers").then((r) => r.json()).then(setSubscribers);
  }, []);

  async function toggleActive(id: string) {
    const res = await fetch("/api/admin/subscribers", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      const updated = await res.json();
      setSubscribers((p) => p.map((s) => s.id === id ? updated : s));
    }
  }

  async function deleteSub(id: string) {
    if (!confirm("Remove this subscriber?")) return;
    await fetch(`/api/admin/subscribers?id=${id}`, { method: "DELETE" });
    setSubscribers((p) => p.filter((s) => s.id !== id));
  }

  const active = subscribers.filter((s) => s.active).length;

  return (
    <AdminWrapper>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-serif">Subscribers</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Newsletter subscribers management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-[var(--border)] p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg"><Users className="text-blue-500" size={20} /></div>
            <div><p className="text-xl font-bold">{subscribers.length}</p><p className="text-xs text-[var(--muted)]">Total</p></div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--border)] p-5 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg"><UserCheck className="text-green-500" size={20} /></div>
            <div><p className="text-xl font-bold">{active}</p><p className="text-xs text-[var(--muted)]">Active</p></div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--border)] p-5 flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-lg"><UserX className="text-red-500" size={20} /></div>
            <div><p className="text-xl font-bold">{subscribers.length - active}</p><p className="text-xs text-[var(--muted)]">Inactive</p></div>
          </div>
        </div>

        {/* List */}
        <div className="bg-white rounded-xl border border-[var(--border)]">
          {subscribers.length === 0 ? (
            <div className="text-center py-16">
              <Users className="mx-auto text-gray-300 mb-3" size={44} />
              <p className="font-semibold mb-1">No subscribers yet</p>
              <p className="text-sm text-[var(--muted)]">Subscribers will appear here when people sign up via the newsletter form.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 border-b border-[var(--border)]">
                  <th className="text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3">Email</th>
                  <th className="text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3 hidden sm:table-cell">Date</th>
                  <th className="text-center text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3">Status</th>
                  <th className="text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((sub) => (
                  <tr key={sub.id} className="border-t border-[var(--border)] hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 text-sm font-medium">{sub.email}</td>
                    <td className="px-5 py-4 text-xs text-[var(--muted)] hidden sm:table-cell">{new Date(sub.subscribedAt).toLocaleDateString()}</td>
                    <td className="px-5 py-4 text-center">
                      <button onClick={() => toggleActive(sub.id)} className={`text-xs font-medium px-2.5 py-1 rounded-full ${sub.active ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                        {sub.active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => deleteSub(sub.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
