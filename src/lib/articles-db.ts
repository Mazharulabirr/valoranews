import fs from "fs";
import path from "path";

export interface CustomArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  category: string;
  author: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "articles.json");

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export function getAllArticles(): CustomArticle[] {
  ensureDataFile();
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

export function getPublishedArticles(): CustomArticle[] {
  return getAllArticles().filter((a) => a.published);
}

export function getArticleById(id: string): CustomArticle | undefined {
  return getAllArticles().find((a) => a.id === id);
}

export function createArticle(
  article: Omit<CustomArticle, "id" | "createdAt" | "updatedAt">
): CustomArticle {
  const articles = getAllArticles();
  const newArticle: CustomArticle = {
    ...article,
    id: "custom-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  articles.unshift(newArticle);
  fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2));
  return newArticle;
}

export function updateArticle(
  id: string,
  updates: Partial<Omit<CustomArticle, "id" | "createdAt">>
): CustomArticle | null {
  const articles = getAllArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return null;

  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(DATA_FILE, JSON.stringify(articles, null, 2));
  return articles[index];
}

export function deleteArticle(id: string): boolean {
  const articles = getAllArticles();
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length === articles.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return true;
}
