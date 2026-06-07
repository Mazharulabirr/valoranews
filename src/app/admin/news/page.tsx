"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { EyeOff, Eye, RefreshCw, Newspaper } from "lucide-react";
import AdminWrapper from "@/components/AdminWrapper";
import { CATEGORIES } from "@/lib/types";
import { Article } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface HiddenEntry {
  id: string;
  title: string;
  source: string;
  hiddenAt: string;
}

export default function ManageNews() {
  const router = useRouter();
  const [category, setCategory] = useState("World");
  const [articles, setArticles] = useState<Article[]>([]);
  const [hidden, setHidden] = useState<HiddenEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/admin/news?category=${category.toLowerCase()}`
      );
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const data = await res.json();
      setArticles(data.articles || []);
      setHidden(data.hidden || []);
    } catch {
      // keep whatever we had
    } finally {
      setLoading(false);
    }
  }, [category, router]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  async function handleHide(article: Article) {
    setBusyId(article.id);
    try {
      const res = await fetch("/api/admin/news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: article.id,
          title: article.title,
          source: article.source.name,
        }),
      });
      if (res.ok) {
        setArticles((prev) => prev.filter((a) => a.id !== article.id));
        setHidden((prev) => [
          {
            id: article.id,
            title: article.title,
            source: article.source.name,
            hiddenAt: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
    } finally {
      setBusyId(null);
    }
  }

  async function handleUnhide(entry: HiddenEntry) {
    setBusyId(entry.id);
    try {
      const res = await fetch("/api/admin/news", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: entry.id }),
      });
      if (res.ok) {
        setHidden((prev) => prev.filter((h) => h.id !== entry.id));
        fetchNews();
      }
    } finally {
      setBusyId(null);
    }
  }

  return (
    <AdminWrapper>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold font-serif flex items-center gap-2">
              <Newspaper size={24} className="text-[var(--accent)]" />
              Manage News
            </h1>
            <p className="text-sm text-[var(--muted)] mt-1">
              Hide RSS news you don&apos;t want on the site, or bring hidden ones back.
            </p>
          </div>
          <button
            onClick={fetchNews}
            className="flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
          >
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                category === cat
                  ? "bg-[var(--accent)] text-white"
                  : "bg-white border border-[var(--border)] text-gray-600 hover:border-[var(--accent)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Live news list */}
        <div className="bg-white rounded-xl border border-[var(--border)] divide-y divide-[var(--border)] mb-10">
          {loading ? (
            <div className="p-10 text-center text-[var(--muted)]">
              <span className="inline-block w-6 h-6 border-2 border-gray-200 border-t-[var(--accent)] rounded-full animate-spin" />
            </div>
          ) : articles.length === 0 ? (
            <div className="p-10 text-center text-[var(--muted)] text-sm">
              No news found in this category.
            </div>
          ) : (
            articles.map((article) => (
              <div key={article.id} className="flex items-center gap-4 p-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1">{article.title}</p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    {article.source.name} ·{" "}
                    {formatDistanceToNow(new Date(article.publishedAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleHide(article)}
                  disabled={busyId === article.id}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-600 border border-[var(--border)] hover:border-red-300 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                >
                  <EyeOff size={13} />
                  Hide
                </button>
              </div>
            ))
          )}
        </div>

        {/* Hidden news */}
        <h2 className="font-bold text-lg font-serif mb-3">
          Hidden News{" "}
          <span className="text-sm font-normal text-[var(--muted)]">
            ({hidden.length})
          </span>
        </h2>
        <div className="bg-white rounded-xl border border-[var(--border)] divide-y divide-[var(--border)]">
          {hidden.length === 0 ? (
            <div className="p-8 text-center text-[var(--muted)] text-sm">
              Nothing is hidden right now.
            </div>
          ) : (
            hidden.map((entry) => (
              <div key={entry.id} className="flex items-center gap-4 p-4 bg-gray-50/50">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm line-clamp-1 text-gray-500">
                    {entry.title}
                  </p>
                  <p className="text-xs text-[var(--muted)] mt-0.5">
                    {entry.source} · hidden{" "}
                    {formatDistanceToNow(new Date(entry.hiddenAt), {
                      addSuffix: true,
                    })}
                  </p>
                </div>
                <button
                  onClick={() => handleUnhide(entry)}
                  disabled={busyId === entry.id}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-green-600 border border-[var(--border)] hover:border-green-300 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
                >
                  <Eye size={13} />
                  Show again
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminWrapper>
  );
}
