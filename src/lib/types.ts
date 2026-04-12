export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  category?: string;
}

export interface NewsResponse {
  totalArticles: number;
  articles: Article[];
}

export const CATEGORIES = [
  "World",
  "Politics",
  "Business",
  "Technology",
  "Sports",
  "Entertainment",
  "Health",
  "Science",
  "Environment",
] as const;

export type Category = (typeof CATEGORIES)[number];
