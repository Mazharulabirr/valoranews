import { getTopHeadlines } from "@/lib/api";
import { CATEGORIES } from "@/lib/types";
import ArticleCard from "@/components/ArticleCard";
import SectionTitle from "@/components/SectionTitle";
import Sidebar from "@/components/Sidebar";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const categoryName =
    CATEGORIES.find((c) => c.toLowerCase() === slug) ||
    slug.charAt(0).toUpperCase() + slug.slice(1);

  const [articles, allHeadlines] = await Promise.all([
    getTopHeadlines(slug, 10),
    getTopHeadlines(undefined, 10),
  ]);

  const editorsPicks = allHeadlines.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8 pb-6 border-b border-[var(--border)]">
        <span className="text-sm font-semibold text-[var(--accent)] uppercase tracking-wider">
          Category
        </span>
        <h1 className="text-3xl md:text-4xl font-bold font-serif mt-1">
          {categoryName}
        </h1>
        <p className="text-[var(--muted)] mt-2">
          Latest {categoryName.toString().toLowerCase()} news and analysis from around the world.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Articles Grid */}
        <div className="lg:col-span-2">
          <SectionTitle title="Latest Stories" />
          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-[var(--muted)] text-lg">
                No articles found in this category.
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <Sidebar editorsPicks={editorsPicks} />
      </div>
    </div>
  );
}
