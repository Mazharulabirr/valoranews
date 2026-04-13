"use client";

import { useState, useEffect } from "react";
import AdminWrapper from "@/components/AdminWrapper";
import { Save, Check } from "lucide-react";

interface Settings {
  siteName: string; tagline: string; description: string;
  contactEmail: string; contactPhone: string; contactAddress: string;
  socialFacebook: string; socialTwitter: string; socialYoutube: string; socialInstagram: string;
  footerText: string; analyticsId: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then(setSettings);
  }, []);

  function update(field: string, value: string) {
    setSettings((p) => p ? { ...p, [field]: value } : p);
    setSaved(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/settings", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (!settings) return (
    <AdminWrapper><div className="flex items-center justify-center h-96"><div className="w-8 h-8 border-3 border-gray-200 border-t-[var(--accent)] rounded-full animate-spin" /></div></AdminWrapper>
  );

  const sections = [
    {
      title: "General",
      fields: [
        { key: "siteName", label: "Site Name", type: "text" },
        { key: "tagline", label: "Tagline", type: "text" },
        { key: "description", label: "Site Description", type: "textarea" },
        { key: "footerText", label: "Footer Text", type: "textarea" },
      ],
    },
    {
      title: "Contact Information",
      fields: [
        { key: "contactEmail", label: "Email", type: "email" },
        { key: "contactPhone", label: "Phone", type: "text" },
        { key: "contactAddress", label: "Address", type: "text" },
      ],
    },
    {
      title: "Social Media Links",
      fields: [
        { key: "socialFacebook", label: "Facebook URL", type: "url" },
        { key: "socialTwitter", label: "Twitter / X URL", type: "url" },
        { key: "socialYoutube", label: "YouTube URL", type: "url" },
        { key: "socialInstagram", label: "Instagram URL", type: "url" },
      ],
    },
    {
      title: "Analytics",
      fields: [
        { key: "analyticsId", label: "Google Analytics ID", type: "text" },
      ],
    },
  ];

  return (
    <AdminWrapper>
      <form onSubmit={handleSave} className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-serif">Site Settings</h1>
            <p className="text-sm text-[var(--muted)] mt-1">Configure your website</p>
          </div>
          <button type="submit" disabled={saving} className="flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[var(--accent-dark)] transition-all disabled:opacity-50">
            {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saved ? <Check size={16} /> : <Save size={16} />}
            {saved ? "Saved!" : "Save Settings"}
          </button>
        </div>

        <div className="space-y-8 max-w-3xl">
          {sections.map((section) => (
            <div key={section.title} className="bg-white rounded-xl border border-[var(--border)] p-6">
              <h2 className="font-bold text-base mb-5 pb-3 border-b border-[var(--border)]">{section.title}</h2>
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea value={(settings as unknown as Record<string, string>)[field.key] || ""} onChange={(e) => update(field.key, e.target.value)} rows={3} className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] text-sm resize-none" />
                    ) : (
                      <input type={field.type} value={(settings as unknown as Record<string, string>)[field.key] || ""} onChange={(e) => update(field.key, e.target.value)} className="w-full px-4 py-2.5 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] text-sm" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </form>
    </AdminWrapper>
  );
}
