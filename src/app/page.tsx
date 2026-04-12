import { getTopHeadlines } from "@/lib/api";
import HeroSection from "@/components/HeroSection";
import ArticleCard from "@/components/ArticleCard";
import SectionTitle from "@/components/SectionTitle";
import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let headlines, techNews, sportsNews;

  try {
    [headlines, techNews, sportsNews] = await Promise.all([
      getTopHeadlines(undefined, 10),
      getTopHeadlines("technology", 5),
      getTopHeadlines("sports", 5),
    ]);
  } catch {
    headlines = await getTopHeadlines(undefined, 10);
    techNews = await getTopHeadlines("technology", 5);
    sportsNews = await getTopHeadlines("sports", 5);
  }

  const featured = headlines[0];
  const sideHero = headlines.slice(1, 4);
  const recentPosts = headlines.slice(4, 8);
  const editorsPicks = headlines.slice(5, 10);
  const latestPosts = [...techNews.slice(0, 3), ...sportsNews.slice(0, 3)];

  return (
    <>
      {/* Hero */}
      {featured && <HeroSection featured={featured} sideArticles={sideHero} />}

      {/* Recent Posts + Sidebar */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <SectionTitle
              title="Recent Posts"
              subtitle="The latest stories from around the world"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {recentPosts.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Latest Posts - Horizontal */}
            <div className="mt-12">
              <SectionTitle
                title="Latest Posts"
                subtitle="More stories you might enjoy"
              />
              <div className="space-y-2">
                {latestPosts.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="horizontal"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <Sidebar editorsPicks={editorsPicks} />
        </div>
      </section>
    </>
  );
}
