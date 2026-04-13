"use client";

import { useState, useEffect } from "react";
import AdminWrapper from "@/components/AdminWrapper";
import { Plus, Trash2, X } from "lucide-react";

interface Category {
  id: string; name: string; slug: string; description: string; color: string; enabled: boolean;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newColor, setNewColor] = useState("#6b7280");

  useEffect(() => {
    fetch("/api/admin/categories").then((r) => r.json()).then(setCategories);
  }, []);

  async function addCat(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName, description: newDesc, color: newColor }),
    });
    if (res.ok) {
      const cat = await res.json();
      setCategories((p) => [...p, cat]);
      setNewName(""); setNewDesc(""); setShowAdd(false);
    }
  }

  async function toggleEnabled(cat: Category) {
    await fetch("/api/admin/categories", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: cat.id, enabled: !cat.enabled }),
    });
    setCategories((p) => p.map((c) => c.id === cat.id ? { ...c, enabled: !c.enabled } : c));
  }

  async function deleteCat(id: string) {
    if (!confirm("Delete this category?")) return;
    await fetch(`/api/admin/categories?id=${id}`, { method: "DELETE" });
    setCategories((p) => p.filter((c) => c.id !== id));
  }

  return (
    <AdminWrapper>
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold font-serif">Categories</h1>
            <p className="text-sm text-[var(--muted)] mt-1">Manage news categories</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[var(--accent-dark)] transition-all">
            {showAdd ? <X size={16} /> : <Plus size={16} />} {showAdd ? "Cancel" : "Add Category"}
          </button>
        </div>

        {/* Add Form */}
        {showAdd && (
          <form onSubmit={addCat} className="bg-white rounded-xl border border-[var(--border)] p-5 mb-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Name *</label>
                <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g. Lifestyle" className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] text-sm" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Description</label>
                <input type="text" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Short description" className="w-full px-3 py-2.5 border border-[var(--border)] rounded-lg outline-none focus:border-[var(--accent)] text-sm" />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Color</label>
                  <input type="color" value={newColor} onChange={(e) => setNewColor(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" />
                </div>
                <button type="submit" className="px-5 py-2.5 bg-[var(--accent)] text-white rounded-lg text-sm font-semibold hover:bg-[var(--accent-dark)] transition-colors">Add</button>
              </div>
            </div>
          </form>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-xl border border-[var(--border)]">
          {categories.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] last:border-0 hover:bg-gray-50/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ backgroundColor: cat.color }} />
                <div>
                  <p className="font-medium text-sm">{cat.name}</p>
                  <p className="text-xs text-[var(--muted)]">{cat.description || cat.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => toggleEnabled(cat)} className={`text-xs font-medium px-3 py-1 rounded-full transition-colors ${cat.enabled ? "bg-green-50 text-green-600" : "bg-gray-100 text-gray-500"}`}>
                  {cat.enabled ? "Active" : "Disabled"}
                </button>
                <button onClick={() => deleteCat(cat.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminWrapper>
  );
}
