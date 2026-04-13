"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminWrapper from "@/components/AdminWrapper";
import {
  Plus, Edit, Trash2, FileText, Eye, EyeOff, Search, LayoutDashboard, Users, TrendingUp,
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  published: boolean;
  createdAt: string;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [subscribers, setSubscribers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const fetchData = useCallback(async () => {
    try {
      const [artRes, subRes] = await Promise.all([
        fetch("/api/admin/articles"),
        fetch("/api/admin/subscribers"),
      ]);
      if (artRes.status === 401) { router.push("/admin/login"); return; }
      setArticles(await artRes.json());
      if (subRes.ok) { const subs = await subRes.json(); setSubscribers(subs.length); }
    } catch { router.push("/admin/login"); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this article?")) return;
    setDeleting(id);
    await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
    setArticles((p) => p.filter((a) => a.id !== id));
    setDeleting(null);
  }

  async function togglePublish(id: string, published: boolean) {
    await fetch(`/api/admin/articles/${id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !published }),
    });
    setArticles((p) => p.map((a) => (a.id === id ? { ...a, published: !published } : a)));
  }

  const filtered = articles.filter(
    (a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return (
    <AdminWrapper>
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-[var(--accent)] rounded-full animate-spin" />
      </div>
    </AdminWrapper>
  );

  return (
    <AdminWrapper>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold font-serif">Dashboard</h1>
            <p className="text-sm text-[var(--muted)] mt-1">Welcome back! Here&apos;s your overview.</p>
          </div>
          <Link href="/admin/articles/new" className="flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[var(--accent-dark)] transition-all">
            <Plus size={16} /> New Article
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { icon: FileText, label: "Total Articles", value: articles.length, color: "blue", bg: "bg-blue-50" },
            { icon: Eye, label: "Published", value: articles.filter((a) => a.published).length, color: "green", bg: "bg-green-50" },
            { icon: LayoutDashboard, label: "Drafts", value: articles.filter((a) => !a.published).length, color: "orange", bg: "bg-orange-50" },
            { icon: Users, label: "Subscribers", value: subscribers, color: "purple", bg: "bg-purple-50" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-[var(--border)] p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`p-3 ${stat.bg} rounded-lg`}>
                <stat.icon className={`text-${stat.color}-500`} size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-[var(--muted)]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { href: "/admin/articles/new", label: "Write Article", icon: FileText },
            { href: "/admin/categories", label: "Categories", icon: TrendingUp },
            { href: "/admin/subscribers", label: "Subscribers", icon: Users },
            { href: "/admin/settings", label: "Settings", icon: LayoutDashboard },
          ].map((action) => (
            <Link key={action.href} href={action.href} className="bg-white border border-[var(--border)] rounded-xl p-4 text-center hover:shadow-md hover:border-[var(--accent)] transition-all group">
              <action.icon className="mx-auto text-gray-400 group-hover:text-[var(--accent)] transition-colors mb-2" size={22} />
              <p className="text-xs font-medium text-gray-600">{action.label}</p>
            </Link>
          ))}
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-xl border border-[var(--border)]">
          <div className="p-5 border-b border-[var(--border)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <h2 className="font-bold text-lg">Articles</h2>
            <div className="flex items-center gap-2 bg-gray-50 border border-[var(--border)] rounded-lg px-3 py-2 w-full sm:w-72">
              <Search size={15} className="text-gray-400" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="outline-none text-sm flex-1 bg-transparent" />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="mx-auto text-gray-300 mb-3" size={44} />
              <p className="font-semibold mb-1">No articles found</p>
              <p className="text-sm text-[var(--muted)]">Create your first article to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3">Title</th>
                    <th className="text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3 hidden md:table-cell">Category</th>
                    <th className="text-left text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3 hidden md:table-cell">Date</th>
                    <th className="text-center text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3">Status</th>
                    <th className="text-right text-[11px] font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((article) => (
                    <tr key={article.id} className="border-t border-[var(--border)] hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-4"><p className="font-medium text-sm line-clamp-2 max-w-md">{article.title}</p><p className="text-[11px] text-[var(--muted)] mt-0.5">{article.author}</p></td>
                      <td className="px-5 py-4 hidden md:table-cell"><span className="text-xs font-medium bg-gray-100 px-2.5 py-1 rounded-full">{article.category}</span></td>
                      <td className="px-5 py-4 hidden md:table-cell"><span className="text-xs text-[var(--muted)]">{new Date(article.createdAt).toLocaleDateString()}</span></td>
                      <td className="px-5 py-4 text-center">
                        <button onClick={() => togglePublish(article.id, article.published)} className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${article.published ? "bg-green-50 text-green-600" : "bg-orange-50 text-orange-600"}`}>
                          {article.published ? <><Eye size={11} /> Live</> : <><EyeOff size={11} /> Draft</>}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/admin/articles/${article.id}`} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"><Edit size={15} /></Link>
                          <button onClick={() => handleDelete(article.id)} disabled={deleting === article.id} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50">
                            {deleting === article.id ? <span className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin block" /> : <Trash2 size={15} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
