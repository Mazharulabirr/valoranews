import { NextRequest, NextResponse } from "next/server";
import { getAllArticles, createArticle } from "@/lib/articles-db";
import { isAuthenticated } from "@/lib/auth-check";

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getAllArticles());
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const { title, description, content, image, category, author, published } = body;
  if (!title || !description || !content) {
    return NextResponse.json({ error: "Title, description, and content are required" }, { status: 400 });
  }
  const article = createArticle({
    title, description, content,
    image: image || "https://images.unsplash.com/photo-1504711434969-e33886168d5c?w=800&q=80",
    category: category || "World",
    author: author || "Velora News",
    published: published ?? true,
  });
  return NextResponse.json(article, { status: 201 });
}
