import Link from "next/link";
import { Article } from "@/lib/types";

interface NewsTickerProps {
  articles: Article[];
}

export default function NewsTicker({ articles }: NewsTickerProps) {
  const tickerItems = [...articles, ...articles]; // duplicate for seamless loop

  return (
    <div className="bg-[var(--dark-bg)] border-b border-gray-700">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Label */}
        <div className="flex-shrink-0 breaking-flash px-4 py-2.5 flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse-dot" />
          <span className="text-white text-xs font-bold tracking-wider uppercase">
            Breaking
          </span>
        </div>

        {/* Marquee */}
        <div className="overflow-hidden flex-1 py-2.5">
          <div className="flex animate-marquee whitespace-nowrap">
            {tickerItems.map((article, i) => (
              <Link
                key={`${article.id}-${i}`}
                href={`/article/${article.id}`}
                className="inline-flex items-center text-sm text-gray-300 hover:text-white transition-colors duration-300 mx-8"
              >
                <span className="text-[var(--accent)] mr-2">&#9679;</span>
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
