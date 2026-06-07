import { XMLParser } from "fast-xml-parser";
import { Article } from "./types";
import {
  CustomArticle,
  getPublishedArticles,
  getArticleById as getCustomArticleById,
} from "./articles-db";
import { getHiddenIds } from "./hidden-news";

// Free, unlimited, real-time RSS feeds from major world news outlets.
// No API key or quota — replaces the GNews API (free tier had a 12-hour
// delay and a 100 requests/day limit, which made the site go stale).
const FEEDS: Record<string, { url: string; source: string }[]> = {
  world: [
    { url: "https://feeds.bbci.co.uk/news/world/rss.xml", source: "BBC News" },
    { url: "https://www.theguardian.com/world/rss", source: "The Guardian" },
    { url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml", source: "NY Times" },
  ],
  politics: [
    { url: "https://feeds.bbci.co.uk/news/politics/rss.xml", source: "BBC News" },
    { url: "https://www.theguardian.com/politics/rss", source: "The Guardian" },
  ],
  business: [
    { url: "https://feeds.bbci.co.uk/news/business/rss.xml", source: "BBC News" },
    { url: "https://www.theguardian.com/uk/business/rss", source: "The Guardian" },
  ],
  technology: [
    { url: "https://feeds.bbci.co.uk/news/technology/rss.xml", source: "BBC News" },
    { url: "https://www.theguardian.com/uk/technology/rss", source: "The Guardian" },
  ],
  sports: [
    { url: "https://feeds.bbci.co.uk/sport/rss.xml", source: "BBC Sport" },
    { url: "https://www.theguardian.com/uk/sport/rss", source: "The Guardian" },
  ],
  entertainment: [
    { url: "https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml", source: "BBC News" },
    { url: "https://www.theguardian.com/uk/culture/rss", source: "The Guardian" },
  ],
  health: [
    { url: "https://feeds.bbci.co.uk/news/health/rss.xml", source: "BBC News" },
    { url: "https://www.theguardian.com/society/health/rss", source: "The Guardian" },
  ],
  science: [
    { url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", source: "BBC News" },
    { url: "https://www.theguardian.com/science/rss", source: "The Guardian" },
  ],
  environment: [
    { url: "https://www.theguardian.com/environment/rss", source: "The Guardian" },
    { url: "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml", source: "BBC News" },
  ],
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&q=80";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
});

interface RssItem {
  title?: string;
  link?: string;
  description?: string;
  pubDate?: string;
  "media:thumbnail"?: { "@_url"?: string } | { "@_url"?: string }[];
  "media:content"?:
    | { "@_url"?: string; "@_width"?: string }
    | { "@_url"?: string; "@_width"?: string }[];
  enclosure?: { "@_url"?: string; "@_type"?: string };
}

function generateId(url: string, index: number): string {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36) + index;
}

function stripHtml(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function extractImage(item: RssItem): string {
  // media:thumbnail (BBC) — upgrade the tiny 240px thumb to 800px
  const thumb = Array.isArray(item["media:thumbnail"])
    ? item["media:thumbnail"][0]
    : item["media:thumbnail"];
  if (thumb?.["@_url"]) {
    return thumb["@_url"].replace(/\/standard\/\d+\//, "/standard/800/");
  }

  // media:content (Guardian, NYT) — pick the widest variant
  const media = item["media:content"];
  if (media) {
    const list = Array.isArray(media) ? media : [media];
    const best = list
      .filter((m) => m["@_url"])
      .sort((a, b) => Number(b["@_width"] || 0) - Number(a["@_width"] || 0))[0];
    if (best?.["@_url"]) return best["@_url"];
  }

  // enclosure fallback
  if (item.enclosure?.["@_url"] && item.enclosure["@_type"]?.startsWith("image")) {
    return item.enclosure["@_url"];
  }

  return FALLBACK_IMAGE;
}

async function fetchFeed(
  feed: { url: string; source: string },
  category: string
): Promise<Article[]> {
  try {
    const res = await fetch(feed.url, {
      next: { revalidate: 300 },
      headers: { "User-Agent": "Mozilla/5.0 (compatible; PulseWire/1.0)" },
    });
    if (!res.ok) {
      console.error(`RSS feed error (${feed.source}):`, res.status);
      return [];
    }

    const xml = await res.text();
    const data = parser.parse(xml);
    const items: RssItem[] = data?.rss?.channel?.item || [];

    return items
      .filter((item) => item.title && item.link)
      .map((item, i) => {
        const description = stripHtml(item.description || "");
        const image = extractImage(item);
        return {
          id: generateId(item.link!, i),
          title: stripHtml(item.title!),
          description,
          content: description,
          url: item.link!,
          image: image.startsWith("https://") ? image : FALLBACK_IMAGE,
          publishedAt: item.pubDate
            ? new Date(item.pubDate).toISOString()
            : new Date().toISOString(),
          source: { name: feed.source, url: feed.url },
          category: category.charAt(0).toUpperCase() + category.slice(1),
        };
      });
  } catch (error) {
    console.error(`Error fetching RSS feed (${feed.source}):`, error);
    return [];
  }
}

async function fetchCategory(category: string): Promise<Article[]> {
  const feeds = FEEDS[category.toLowerCase()] || FEEDS.world;
  const results = await Promise.all(feeds.map((f) => fetchFeed(f, category)));

  // Interleave sources so one outlet doesn't dominate, dedupe by title,
  // then sort newest first
  const seen = new Set<string>();
  const merged: Article[] = [];
  const maxLen = Math.max(...results.map((r) => r.length), 0);
  for (let i = 0; i < maxLen; i++) {
    for (const list of results) {
      const article = list[i];
      if (!article) continue;
      const key = article.title.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      merged.push(article);
    }
  }

  return merged.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Convert an admin-created post to the public Article shape
function customToArticle(c: CustomArticle): Article {
  return {
    id: c.id,
    title: c.title,
    description: c.description,
    content: c.content,
    url: "#",
    image: c.image || FALLBACK_IMAGE,
    publishedAt: c.createdAt,
    source: { name: c.author, url: "#" },
    category: c.category,
  };
}

// Published admin posts for a category (all posts when no category given)
function getCustomPosts(category?: string): { featured: Article[]; rest: Article[] } {
  try {
    let posts = getPublishedArticles();
    if (category && category.toLowerCase() !== "world") {
      posts = posts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase()
      );
    }
    return {
      featured: posts.filter((p) => p.featured).map(customToArticle),
      rest: posts.filter((p) => !p.featured).map(customToArticle),
    };
  } catch (error) {
    console.error("Error reading custom articles:", error);
    return { featured: [], rest: [] };
  }
}

export async function getTopHeadlines(
  category?: string,
  max: number = 10
): Promise<Article[]> {
  const rss = await fetchCategory(category || "world");
  const news = rss.length > 0 ? rss : getFallbackArticles(category);

  // Drop RSS articles the admin has hidden
  let hidden: Set<string>;
  try {
    hidden = getHiddenIds();
  } catch {
    hidden = new Set();
  }
  const visible = news.filter((a) => !hidden.has(a.id));

  // Admin posts: featured ones pinned first (hero banner), the rest
  // merged with RSS news by date
  const { featured, rest } = getCustomPosts(category);
  const merged = [...rest, ...visible].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  return [...featured, ...merged].slice(0, max);
}

export async function searchNews(
  query: string,
  max: number = 10
): Promise<Article[]> {
  if (!query.trim()) return getFallbackArticles();

  const categories = Object.keys(FEEDS);
  const results = await Promise.all(categories.map((c) => fetchCategory(c)));

  const q = query.toLowerCase();
  const seen = new Set<string>();
  const matches: Article[] = [];
  const { featured, rest } = getCustomPosts();
  for (const article of [...featured, ...rest, ...results.flat()]) {
    if (seen.has(article.title.toLowerCase())) continue;
    if (
      article.title.toLowerCase().includes(q) ||
      article.description.toLowerCase().includes(q)
    ) {
      seen.add(article.title.toLowerCase());
      matches.push(article);
    }
  }

  return matches
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, max);
}

// Get a single article by ID - searches across categories
export async function getArticleById(id: string): Promise<Article | null> {
  // Admin-created posts have a "custom-" id prefix — read straight from disk
  if (id.startsWith("custom-")) {
    try {
      const custom = getCustomArticleById(id);
      return custom && custom.published ? customToArticle(custom) : null;
    } catch {
      return null;
    }
  }

  for (const category of Object.keys(FEEDS)) {
    const articles = await fetchCategory(category);
    const match = articles.find((a) => a.id === id);
    if (match) return match;
  }

  return getFallbackArticles().find((a) => a.id === id) || null;
}

function getFallbackArticles(category?: string): Article[] {
  const articles: Article[] = [
    {
      id: "fall01",
      title: "Global Leaders Gather for Historic Climate Summit",
      description:
        "World leaders convene to discuss ambitious new targets for carbon reduction as climate urgency grows across all continents.",
      content:
        "In a landmark gathering, heads of state from over 150 countries have assembled to negotiate the next phase of global climate action. The summit aims to establish binding commitments for carbon neutrality by 2040, with developing nations pushing for increased financial support from industrialized countries.\n\nExperts say this could be the most consequential climate meeting since the Paris Agreement. The discussions focus on three key areas: emissions reduction targets, climate finance mechanisms, and adaptation strategies for vulnerable nations.\n\nUN Secretary-General emphasized the urgency of the situation, noting that current commitments fall short of what science demands. Several major economies have already announced enhanced pledges, including commitments to phase out coal power and triple renewable energy capacity.\n\nThe summit is also addressing the growing issue of climate migration, with proposals for international frameworks to support displaced communities. Environmental groups have organized parallel events to push for more ambitious action.",
      url: "#",
      image: "https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&q=80",
      publishedAt: new Date().toISOString(),
      source: { name: "Velora News", url: "#" },
      category: "World",
    },
    {
      id: "fall02",
      title: "Tech Giants Report Record Earnings Amid AI Revolution",
      description:
        "Major technology companies see unprecedented revenue growth driven by artificial intelligence investments and cloud computing.",
      content:
        "The world's largest technology companies have reported record-breaking quarterly earnings, largely driven by the explosive growth in artificial intelligence products and services. Analysts note that enterprise AI adoption has accelerated faster than predicted, with cloud computing revenues seeing double-digit growth across the board.\n\nMicrosoft, Google, and Amazon all reported significant gains in their cloud divisions, with AI-related services being the primary growth driver. The semiconductor industry has also benefited enormously, with chip makers struggling to meet the unprecedented demand for AI training hardware.\n\nHowever, some analysts warn of potential overvaluation in the AI sector, drawing parallels to previous technology bubbles. Despite these concerns, corporate spending on AI infrastructure shows no signs of slowing down, with major enterprises committing billions to digital transformation initiatives.\n\nThe earnings season has also highlighted the growing importance of AI safety and regulation, with several companies announcing new governance frameworks for their AI products.",
      url: "#",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80",
      publishedAt: new Date(Date.now() - 3600000).toISOString(),
      source: { name: "TechInsider", url: "#" },
      category: "Technology",
    },
    {
      id: "fall03",
      title: "Champions League Delivers Dramatic Semi-Final Upsets",
      description:
        "Underdog teams stun favorites in a night of extraordinary football across European stadiums with last-minute goals.",
      content:
        "In one of the most dramatic nights in Champions League history, two heavily favored teams were eliminated in stunning fashion. Late goals and penalty shootouts kept millions of fans on the edge of their seats as the semi-finals delivered unforgettable moments of sporting drama.\n\nThe first match saw a remarkable comeback from a team that had been trailing 3-0 on aggregate, scoring four goals in the final 30 minutes to advance on away goals. The second fixture was equally thrilling, with a 95th-minute winner sending the underdogs through to the final.\n\nFootball pundits have described the evening as one of the greatest in the tournament's storied history. Both advancing teams will now prepare for a final that promises to be a clash of contrasting styles and philosophies.\n\nTicket demand for the final has already broken records, with organizers expecting a global television audience of over 400 million viewers.",
      url: "#",
      image: "https://images.unsplash.com/photo-1553778263-73a83bab9b0c?w=800&q=80",
      publishedAt: new Date(Date.now() - 7200000).toISOString(),
      source: { name: "SportsPulse", url: "#" },
      category: "Sports",
    },
    {
      id: "fall04",
      title: "New Study Reveals Benefits of Mediterranean Diet on Brain Health",
      description:
        "Research shows that a Mediterranean-style diet can significantly reduce cognitive decline in older adults over a decade.",
      content:
        "A comprehensive 10-year study published in a leading medical journal has found that adults who consistently followed a Mediterranean diet showed 35% less cognitive decline compared to those on typical Western diets. The study tracked over 12,000 participants across 15 countries.\n\nResearchers found that the combination of olive oil, fish, nuts, fruits, and vegetables provides a powerful neuroprotective effect. The diet's anti-inflammatory properties appear to be particularly beneficial for brain health, reducing the risk of Alzheimer's disease and other forms of dementia.\n\nThe study also noted improvements in cardiovascular health, reduced depression symptoms, and better overall quality of life among participants following the Mediterranean dietary pattern. Health organizations are now considering updating their dietary guidelines based on these findings.\n\nExperts recommend a gradual transition to Mediterranean-style eating, starting with simple changes like replacing butter with olive oil and increasing fish consumption to twice per week.",
      url: "#",
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80",
      publishedAt: new Date(Date.now() - 10800000).toISOString(),
      source: { name: "HealthDaily", url: "#" },
      category: "Health",
    },
    {
      id: "fall05",
      title: "Central Banks Signal Coordinated Rate Cuts as Inflation Eases",
      description:
        "Major economies prepare for interest rate reductions following months of declining inflation figures worldwide.",
      content:
        "Central banks across the world's largest economies have signaled a coordinated shift toward monetary easing as inflation rates continue their downward trajectory. The Federal Reserve, European Central Bank, and Bank of England all indicated that rate cuts could begin within the next quarter.\n\nThis development brings relief to borrowers and housing markets worldwide, with mortgage rates expected to decline significantly in the coming months. Stock markets have responded positively, with major indices reaching new highs on the news.\n\nEconomists note that the synchronized approach to rate cuts reflects growing confidence that inflation is sustainably returning to target levels. However, some central bankers have cautioned against premature celebration, emphasizing that the path to price stability remains uncertain.\n\nThe business community has welcomed the signals, with several major corporations already announcing increased investment plans in anticipation of lower borrowing costs.",
      url: "#",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
      publishedAt: new Date(Date.now() - 14400000).toISOString(),
      source: { name: "FinanceWire", url: "#" },
      category: "Business",
    },
    {
      id: "fall06",
      title: "Breakthrough in Renewable Energy Storage Changes the Game",
      description:
        "Scientists develop a new battery technology that could make solar and wind power reliable around the clock.",
      content:
        "Researchers at a leading university have unveiled a revolutionary energy storage system that promises to solve one of renewable energy's biggest challenges: intermittency. The new solid-state battery technology can store energy at a fraction of current costs while lasting three times longer than existing lithium-ion solutions.\n\nThe breakthrough relies on a novel combination of abundant materials, making it both economically viable and environmentally sustainable. Early prototypes have demonstrated the ability to store enough energy to power a small city for 72 hours during periods of low wind and solar generation.\n\nEnergy companies have already expressed strong interest in the technology, with several major utilities signing letters of intent for pilot programs. If commercialization proceeds as planned, the technology could be deployed at scale within five years.\n\nAnalysts predict this development could accelerate the global transition away from fossil fuels by removing one of the last major technical barriers to 100% renewable energy grids.",
      url: "#",
      image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80",
      publishedAt: new Date(Date.now() - 18000000).toISOString(),
      source: { name: "ScienceNow", url: "#" },
      category: "Science",
    },
    {
      id: "fall07",
      title: "Award Season Heats Up With Surprising Film Nominations",
      description:
        "Independent films and streaming platforms dominate this year's major award nominations in an unexpected shift.",
      content:
        "This year's award season has taken an unexpected turn as independent productions and streaming-original films have swept the major nomination categories. Traditional studios find themselves competing against a new wave of storytelling that has resonated with both audiences and critics alike.\n\nThe nominations reflect a broader shift in the entertainment industry, where streaming platforms now command both the budgets and creative freedom that were once the exclusive domain of major studios. Several first-time directors have received nominations, signaling a generational change in filmmaking.\n\nIndustry insiders note that the diversity of this year's nominees represents a significant milestone, with stories from underrepresented communities receiving unprecedented recognition. The ceremony itself is expected to draw substantial viewership as audiences tune in to see if the underdogs can triumph.",
      url: "#",
      image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
      publishedAt: new Date(Date.now() - 21600000).toISOString(),
      source: { name: "CultureBeat", url: "#" },
      category: "Entertainment",
    },
    {
      id: "fall08",
      title: "Historic Peace Agreement Signed After Decades of Conflict",
      description:
        "Two nations formally end hostilities in a ceremony witnessed by international observers and world leaders.",
      content:
        "In a ceremony hailed as a turning point for regional stability, representatives from two long-warring nations signed a comprehensive peace agreement. The deal, brokered over 18 months of intensive negotiations, addresses territorial disputes, refugee resettlement, and economic cooperation.\n\nThe signing ceremony was attended by heads of state from neighboring countries and representatives from the United Nations, European Union, and African Union. Both leaders expressed hope that the agreement would usher in a new era of prosperity and cooperation.\n\nThe peace deal includes provisions for joint economic development zones, shared water resources management, and a phased withdrawal of military forces from disputed territories. International donors have pledged significant financial support for reconstruction and reconciliation programs.\n\nAnalysts caution that implementation will be the true test of the agreement's durability, noting that previous peace efforts in the region have faltered during the implementation phase.",
      url: "#",
      image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&q=80",
      publishedAt: new Date(Date.now() - 25200000).toISOString(),
      source: { name: "GlobalNews", url: "#" },
      category: "Politics",
    },
    {
      id: "fall09",
      title: "Quantum Computing Milestone Achieved by International Team",
      description:
        "Scientists demonstrate quantum advantage in solving real-world optimization problems for the first time ever.",
      content:
        "A team of physicists and computer scientists has achieved a significant milestone in quantum computing by demonstrating practical quantum advantage on a real-world optimization problem. The breakthrough suggests that quantum computers could soon tackle challenges in drug discovery, logistics, and financial modeling.\n\nThe experiment used a 1,000-qubit processor to solve a complex supply chain optimization problem in minutes that would take classical supercomputers several years. This marks the first time quantum computing has shown clear practical advantages outside of specially designed benchmark problems.\n\nTechnology companies have been quick to respond, with several announcing expanded quantum computing programs and increased research funding. The achievement has also sparked renewed interest from governments in quantum technology development.\n\nResearchers emphasize that while this is a major step forward, practical quantum computers for everyday use are still years away. The current systems require extreme cooling and are sensitive to environmental interference.",
      url: "#",
      image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
      publishedAt: new Date(Date.now() - 28800000).toISOString(),
      source: { name: "TechInsider", url: "#" },
      category: "Technology",
    },
    {
      id: "fall10",
      title: "Global Ocean Cleanup Initiative Removes Record Amount of Plastic",
      description:
        "International effort successfully removes over 10 million tons of plastic waste from the world's oceans this year.",
      content:
        "The Global Ocean Cleanup Initiative has announced a record-breaking year, removing over 10 million tons of plastic waste from the world's oceans. The achievement represents a significant acceleration in cleanup efforts, driven by new technologies and increased international cooperation.\n\nThe initiative deployed advanced autonomous collection systems in the Pacific, Atlantic, and Indian Oceans, targeting the massive garbage patches that have accumulated over decades. New satellite tracking technology allowed teams to identify and target the highest concentration areas with unprecedented precision.\n\nEnvironmental scientists note that while the cleanup effort is commendable, preventing plastic from entering the oceans in the first place remains the most critical challenge. Several countries have announced new legislation to ban single-use plastics and improve waste management infrastructure.\n\nThe initiative has also created thousands of jobs in coastal communities and generated valuable recycled materials from the collected waste.",
      url: "#",
      image: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=800&q=80",
      publishedAt: new Date(Date.now() - 32400000).toISOString(),
      source: { name: "EcoWatch", url: "#" },
      category: "Environment",
    },
  ];

  if (category && category.toLowerCase() !== "world") {
    const filtered = articles.filter(
      (a) => a.category?.toLowerCase() === category.toLowerCase()
    );
    return filtered.length > 0 ? filtered : articles;
  }

  return articles;
}
