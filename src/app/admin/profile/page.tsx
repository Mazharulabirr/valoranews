"use client";

import { useState, useEffect } from "react";
import AdminWrapper from "@/components/AdminWrapper";
import { Save, Check, Eye, EyeOff, UserCircle } from "lucide-react";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/profile").then((r) => r.json()).then((d) => setUsername(d.username || ""));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
      } else {
        setMessage({ type: "error", text: data.error });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong" });
    }
    setSaving(false);
  }

  return (
    <AdminWrapper>
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-serif">Profile</h1>
          <p className="text-sm text-[var(--muted)] mt-1">Manage your admin account</p>
        </div>

        <div className="max-w-lg space-y-6">
          {/* Profile Info */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <div className="flex items-center gap-4 mb-6 pb-5 border-b border-[var(--border)]">
              <div className="w-16 h-16 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-2xl flex items-center justify-center">
                <UserCircle className="text-white" size={32} />
              </div>
              <div>
                <p className="font-bold text-lg">{username}</p>
                <p className="text-sm text-[var(--muted)]">Administrator</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Username</label>
              <input type="text" value={username} disabled className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg text-sm bg-gray-50 text-gray-500" />
            </div>
          </div>

          {/* Change Password */}
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h2 className="font-bold text-base mb-5 pb-3 border-b border-[var(--border)]">Change Password</h2>

            {message && (
              <div className={`mb-4 p-3 rounded-lg text-sm animate-fade-in ${message.type === "success" ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-600"}`}>
                {message.text}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Current Password</label>
                <div className="relative">
                  <input type={showCurrent ? "text" : "password"} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] text-sm pr-10" required />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">New Password</label>
                <div className="relative">
                  <input type={showNew ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] text-sm pr-10" required minLength={6} />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">{showNew ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Confirm New Password</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] text-sm" required minLength={6} />
              </div>
            </div>

            <button type="submit" disabled={saving} className="mt-5 flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[var(--accent-dark)] transition-all disabled:opacity-50">
              {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={15} />}
              Update Password
            </button>
          </form>
        </div>
      </div>
    </AdminWrapper>
  );
}
