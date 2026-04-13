import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

function ensureFile(filename: string, defaultData: unknown) {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  const filepath = path.join(DATA_DIR, filename);
  if (!fs.existsSync(filepath)) {
    fs.writeFileSync(filepath, JSON.stringify(defaultData, null, 2));
  }
  return filepath;
}

function readJSON<T>(filename: string, defaultData: T): T {
  const filepath = ensureFile(filename, defaultData);
  return JSON.parse(fs.readFileSync(filepath, "utf-8"));
}

function writeJSON(filename: string, data: unknown) {
  const filepath = ensureFile(filename, data);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
}

// ===== Site Settings =====
export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialFacebook: string;
  socialTwitter: string;
  socialYoutube: string;
  socialInstagram: string;
  footerText: string;
  analyticsId: string;
}

const defaultSettings: SiteSettings = {
  siteName: "Velora News",
  tagline: "Breaking News & In-Depth Analysis",
  description: "Your trusted source for breaking news, in-depth analysis, and comprehensive coverage.",
  contactEmail: "contact@veloranews.com",
  contactPhone: "+1 (555) 123-4567",
  contactAddress: "123 News Street, New York, NY 10001",
  socialFacebook: "",
  socialTwitter: "",
  socialYoutube: "",
  socialInstagram: "",
  footerText: "Your trusted source for breaking news and in-depth analysis from around the world.",
  analyticsId: "",
};

export function getSettings(): SiteSettings {
  return readJSON("settings.json", defaultSettings);
}

export function updateSettings(updates: Partial<SiteSettings>): SiteSettings {
  const current = getSettings();
  const updated = { ...current, ...updates };
  writeJSON("settings.json", updated);
  return updated;
}

// ===== Categories =====
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  enabled: boolean;
  order: number;
}

const defaultCategories: Category[] = [
  { id: "cat-1", name: "World", slug: "world", description: "Global news coverage", color: "#3b82f6", enabled: true, order: 0 },
  { id: "cat-2", name: "Politics", slug: "politics", description: "Political news and analysis", color: "#8b5cf6", enabled: true, order: 1 },
  { id: "cat-3", name: "Business", slug: "business", description: "Business and economy", color: "#10b981", enabled: true, order: 2 },
  { id: "cat-4", name: "Technology", slug: "technology", description: "Tech news and innovation", color: "#06b6d4", enabled: true, order: 3 },
  { id: "cat-5", name: "Sports", slug: "sports", description: "Sports coverage", color: "#f59e0b", enabled: true, order: 4 },
  { id: "cat-6", name: "Entertainment", slug: "entertainment", description: "Movies, music, culture", color: "#ec4899", enabled: true, order: 5 },
  { id: "cat-7", name: "Health", slug: "health", description: "Health and wellness", color: "#14b8a6", enabled: true, order: 6 },
  { id: "cat-8", name: "Science", slug: "science", description: "Science and discoveries", color: "#6366f1", enabled: true, order: 7 },
  { id: "cat-9", name: "Environment", slug: "environment", description: "Environment and climate", color: "#22c55e", enabled: true, order: 8 },
];

export function getCategories(): Category[] {
  return readJSON("categories.json", defaultCategories);
}

export function addCategory(cat: Omit<Category, "id" | "order">): Category {
  const cats = getCategories();
  const newCat: Category = {
    ...cat,
    id: "cat-" + Date.now().toString(36),
    order: cats.length,
  };
  cats.push(newCat);
  writeJSON("categories.json", cats);
  return newCat;
}

export function updateCategory(id: string, updates: Partial<Category>): Category | null {
  const cats = getCategories();
  const idx = cats.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  cats[idx] = { ...cats[idx], ...updates };
  writeJSON("categories.json", cats);
  return cats[idx];
}

export function deleteCategory(id: string): boolean {
  const cats = getCategories();
  const filtered = cats.filter((c) => c.id !== id);
  if (filtered.length === cats.length) return false;
  writeJSON("categories.json", filtered);
  return true;
}

// ===== Subscribers =====
export interface Subscriber {
  id: string;
  email: string;
  subscribedAt: string;
  active: boolean;
}

export function getSubscribers(): Subscriber[] {
  return readJSON("subscribers.json", []);
}

export function addSubscriber(email: string): Subscriber | null {
  const subs = getSubscribers();
  if (subs.find((s) => s.email === email)) return null;
  const newSub: Subscriber = {
    id: "sub-" + Date.now().toString(36),
    email,
    subscribedAt: new Date().toISOString(),
    active: true,
  };
  subs.push(newSub);
  writeJSON("subscribers.json", subs);
  return newSub;
}

export function deleteSubscriber(id: string): boolean {
  const subs = getSubscribers();
  const filtered = subs.filter((s) => s.id !== id);
  if (filtered.length === subs.length) return false;
  writeJSON("subscribers.json", filtered);
  return true;
}

export function toggleSubscriber(id: string): Subscriber | null {
  const subs = getSubscribers();
  const idx = subs.findIndex((s) => s.id === id);
  if (idx === -1) return null;
  subs[idx].active = !subs[idx].active;
  writeJSON("subscribers.json", subs);
  return subs[idx];
}
