import { NextRequest, NextResponse } from "next/server";
import { getAllArticles, createArticle } from "@/lib/articles-db";
import { ADMIN_SECRET } from "@/lib/admin-config";

function isAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.startsWith(ADMIN_SECRET + ":");
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const articles = getAllArticles();
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, content, image, category, author, published } = body;

  if (!title || !description || !content) {
    return NextResponse.json({ error: "Title, description, and content are required" }, { status: 400 });
  }

  const article = createArticle({
    title,
    description,
    content,
    image: image || "https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&q=80",
    category: category || "World",
    author: author || "Velora News",
    published: published ?? true,
  });

  return NextResponse.json(article, { status: 201 });
}
