"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Image as ImageIcon } from "lucide-react";
import { CATEGORIES } from "@/lib/types";

export default function NewArticle() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    content: "",
    image: "",
    category: "World",
    author: "Velora News",
    published: true,
  });

  function updateField(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (res.ok) {
        router.push("/admin");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create article");
      }
    } catch {
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link
            href="/admin"
            className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          <button
            onClick={handleSubmit}
            disabled={saving || !form.title || !form.content}
            className="flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-[var(--accent-dark)] transition-all duration-300 disabled:opacity-50"
          >
            {saving ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={15} />
            )}
            Publish Article
          </button>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold font-serif mb-8">New Article</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                placeholder="Enter article title..."
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-red-100 transition-all text-lg font-serif"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description *
              </label>
              <textarea
                value={form.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Brief summary of the article..."
                rows={3}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-red-100 transition-all resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Content *
              </label>
              <textarea
                value={form.content}
                onChange={(e) => updateField("content", e.target.value)}
                placeholder="Write your article content here... Use double line breaks for paragraphs."
                rows={16}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] focus:ring-2 focus:ring-red-100 transition-all resize-y leading-relaxed"
                required
              />
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-5">
            <div className="bg-white rounded-xl border border-[var(--border)] p-5 space-y-4">
              <h3 className="font-semibold text-sm">Settings</h3>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] text-sm bg-white"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">
                  Author
                </label>
                <input
                  type="text"
                  value={form.author}
                  onChange={(e) => updateField("author", e.target.value)}
                  className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] text-sm"
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-gray-500">
                  Publish immediately
                </label>
                <button
                  type="button"
                  onClick={() => updateField("published", !form.published)}
                  className={`w-11 h-6 rounded-full transition-colors duration-300 relative ${
                    form.published ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                      form.published ? "translate-x-5.5" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-[var(--border)] p-5">
              <h3 className="font-semibold text-sm mb-3">Featured Image</h3>
              <div className="flex items-center gap-2 mb-3">
                <ImageIcon size={16} className="text-gray-400" />
                <span className="text-xs text-[var(--muted)]">
                  Paste an image URL
                </span>
              </div>
              <input
                type="url"
                value={form.image}
                onChange={(e) => updateField("image", e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] text-sm"
              />
              {form.image && (
                <div className="mt-3 rounded-lg overflow-hidden border border-[var(--border)]">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
