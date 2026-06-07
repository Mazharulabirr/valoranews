import fs from "fs";
import path from "path";

// Admin can hide individual RSS articles from the public site.
// Hidden entries are stored by article id (hash of the source URL).
export interface HiddenNews {
  id: string;
  title: string;
  source: string;
  hiddenAt: string;
}

const DATA_FILE = path.join(process.cwd(), "data", "hidden-news.json");

function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }
}

export function getHiddenNews(): HiddenNews[] {
  ensureDataFile();
  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

export function getHiddenIds(): Set<string> {
  return new Set(getHiddenNews().map((h) => h.id));
}

export function hideNews(entry: { id: string; title: string; source: string }): HiddenNews {
  const hidden = getHiddenNews();
  const existing = hidden.find((h) => h.id === entry.id);
  if (existing) return existing;

  const newEntry: HiddenNews = { ...entry, hiddenAt: new Date().toISOString() };
  hidden.unshift(newEntry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(hidden, null, 2));
  return newEntry;
}

export function unhideNews(id: string): boolean {
  const hidden = getHiddenNews();
  const filtered = hidden.filter((h) => h.id !== id);
  if (filtered.length === hidden.length) return false;
  fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2));
  return true;
}
