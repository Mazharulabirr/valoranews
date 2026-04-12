import { searchNews, getTopHeadlines } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";
import SectionTitle from "@/components/SectionTitle";
import Sidebar from "@/components/Sidebar";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q || "";

  const [results, headlines] = await Promise.all([
    query ? searchNews(query, 10) : Promise.resolve([]),
    getTopHeadlines(undefined, 5),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8 pb-6 border-b border-[var(--border)]">
        <span className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
          Search Results
        </span>
        {query ? (
          <>
            <h1 className="text-3xl md:text-4xl font-bold font-serif mt-1">
              &ldquo;{query}&rdquo;
            </h1>
            <p className="text-[var(--muted)] mt-2">
              {results.length} result{results.length !== 1 ? "s" : ""} found
            </p>
          </>
        ) : (
          <>
            <h1 className="text-3xl md:text-4xl font-bold font-serif mt-1">
              Search News
            </h1>
            <p className="text-[var(--muted)] mt-2">
              Enter a keyword to search for news articles.
            </p>
          </>
        )}

        {/* Search Form */}
        <form action="/search" method="get" className="mt-6 max-w-xl">
          <div className="flex gap-3">
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search for news..."
              className="flex-1 px-5 py-3 border border-[var(--border)] rounded-full outline-none focus:border-[var(--accent)] transition-colors text-base"
            />
            <button
              type="submit"
              className="px-8 py-3 bg-[var(--accent)] text-white rounded-full font-semibold hover:bg-[var(--accent-dark)] transition-colors"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Results */}
        <div className="lg:col-span-2">
          {query && results.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {results.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-16">
              <p className="text-5xl mb-4">🔍</p>
              <h2 className="text-xl font-bold mb-2">No results found</h2>
              <p className="text-[var(--muted)]">
                Try different keywords or browse our categories.
              </p>
            </div>
          ) : (
            <div>
              <SectionTitle title="Trending Now" subtitle="Popular stories right now" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {headlines.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar editorsPicks={headlines} />
      </div>
    </div>
  );
}
