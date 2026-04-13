"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Edit,
  Trash2,
  LogOut,
  FileText,
  Eye,
  EyeOff,
  Search,
  LayoutDashboard,
} from "lucide-react";

interface Article {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminDashboard() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const router = useRouter();

  const fetchArticles = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/articles");
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setArticles(data);
    } catch {
      router.push("/admin/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this article?")) return;
    setDeleting(id);
    try {
      await fetch(`/api/admin/articles/${id}`, { method: "DELETE" });
      setArticles((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete article");
    } finally {
      setDeleting(null);
    }
  }

  async function togglePublish(id: string, published: boolean) {
    try {
      await fetch(`/api/admin/articles/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      setArticles((prev) =>
        prev.map((a) => (a.id === id ? { ...a, published: !published } : a))
      );
    } catch {
      alert("Failed to update article");
    }
  }

  async function handleLogout() {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  }

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const publishedCount = articles.filter((a) => a.published).length;
  const draftCount = articles.filter((a) => !a.published).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-[var(--accent)] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-[var(--border)] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-[var(--accent)] to-[var(--accent-dark)] rounded-lg flex items-center justify-center text-white font-bold font-serif">
              V
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight">Velora News</h1>
              <p className="text-xs text-[var(--muted)]">Admin Panel</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            >
              View Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-red-50"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-[var(--border)] p-5 flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FileText className="text-blue-500" size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold">{articles.length}</p>
              <p className="text-sm text-[var(--muted)]">Total Articles</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--border)] p-5 flex items-center gap-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <Eye className="text-green-500" size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold">{publishedCount}</p>
              <p className="text-sm text-[var(--muted)]">Published</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[var(--border)] p-5 flex items-center gap-4">
            <div className="p-3 bg-orange-50 rounded-lg">
              <LayoutDashboard className="text-orange-500" size={22} />
            </div>
            <div>
              <p className="text-2xl font-bold">{draftCount}</p>
              <p className="text-sm text-[var(--muted)]">Drafts</p>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 bg-white border border-[var(--border)] rounded-lg px-3 py-2 w-full sm:w-80">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="outline-none text-sm flex-1 bg-transparent"
            />
          </div>
          <Link
            href="/admin/articles/new"
            className="flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[var(--accent-dark)] transition-all duration-300 hover:shadow-lg hover:shadow-red-200"
          >
            <Plus size={16} />
            New Article
          </Link>
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="mx-auto text-gray-300 mb-4" size={48} />
              <h3 className="font-bold text-lg mb-1">No articles yet</h3>
              <p className="text-sm text-[var(--muted)] mb-4">
                Create your first article to get started.
              </p>
              <Link
                href="/admin/articles/new"
                className="inline-flex items-center gap-2 bg-[var(--accent)] text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-[var(--accent-dark)] transition-colors"
              >
                <Plus size={16} />
                New Article
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-[var(--border)]">
                    <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3">
                      Title
                    </th>
                    <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                      Category
                    </th>
                    <th className="text-left text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                      Date
                    </th>
                    <th className="text-center text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3">
                      Status
                    </th>
                    <th className="text-right text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-5 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((article) => (
                    <tr
                      key={article.id}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <p className="font-medium text-sm line-clamp-2 max-w-md">
                          {article.title}
                        </p>
                        <p className="text-xs text-[var(--muted)] mt-0.5">
                          {article.author}
                        </p>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="inline-block text-xs font-medium bg-gray-100 px-2.5 py-1 rounded-full">
                          {article.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs text-[var(--muted)]">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <button
                          onClick={() => togglePublish(article.id, article.published)}
                          className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full transition-colors ${
                            article.published
                              ? "bg-green-50 text-green-600 hover:bg-green-100"
                              : "bg-orange-50 text-orange-600 hover:bg-orange-100"
                          }`}
                        >
                          {article.published ? (
                            <>
                              <Eye size={12} /> Published
                            </>
                          ) : (
                            <>
                              <EyeOff size={12} /> Draft
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            href={`/admin/articles/${article.id}`}
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit size={15} />
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id)}
                            disabled={deleting === article.id}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deleting === article.id ? (
                              <span className="w-4 h-4 border-2 border-gray-300 border-t-red-500 rounded-full animate-spin block" />
                            ) : (
                              <Trash2 size={15} />
                            )}
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
    </div>
  );
}
