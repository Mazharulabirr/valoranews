import Link from "next/link";
import Image from "next/image";
import { Clock, TrendingUp } from "lucide-react";
import { Article } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

interface HeroSectionProps {
  featured: Article;
  sideArticles: Article[];
}

export default function HeroSection({
  featured,
  sideArticles,
}: HeroSectionProps) {
  const timeAgo = formatDistanceToNow(new Date(featured.publishedAt), {
    addSuffix: true,
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      {/* Breaking News Ticker */}
      <div className="flex items-center gap-3 mb-6 bg-red-50 border border-red-100 rounded-lg px-4 py-2.5">
        <span className="flex items-center gap-1 text-[var(--accent)] font-bold text-sm whitespace-nowrap">
          <TrendingUp size={16} />
          TRENDING
        </span>
        <div className="overflow-hidden">
          <p className="text-sm text-gray-700 truncate">{featured.title}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Featured */}
        <Link
          href={`/article/${featured.id}`}
          className="lg:col-span-2 group relative rounded-2xl overflow-hidden aspect-[16/9] lg:aspect-auto lg:min-h-[480px]"
        >
          <Image
            src={featured.image}
            alt={featured.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            {featured.category && (
              <span className="inline-block bg-[var(--accent)] text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                {featured.category}
              </span>
            )}
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight font-serif">
              {featured.title}
            </h1>
            <p className="text-gray-300 mt-3 text-sm md:text-base line-clamp-2">
              {featured.description}
            </p>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
              <Clock size={12} />
              <span>{timeAgo}</span>
              <span>&bull;</span>
              <span>{featured.source.name}</span>
            </div>
          </div>
        </Link>

        {/* Side Articles */}
        <div className="flex flex-col gap-4">
          {sideArticles.slice(0, 3).map((article) => {
            const ago = formatDistanceToNow(new Date(article.publishedAt), {
              addSuffix: true,
            });
            return (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="group relative rounded-xl overflow-hidden flex-1 min-h-[145px]"
              >
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  {article.category && (
                    <span className="text-[10px] font-semibold text-[var(--accent)] uppercase tracking-wide">
                      {article.category}
                    </span>
                  )}
                  <h3 className="font-bold text-white text-sm leading-tight mt-1 line-clamp-2 font-serif">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-gray-400">
                    <Clock size={10} />
                    <span>{ago}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
