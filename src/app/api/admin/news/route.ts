import { NextRequest, NextResponse } from "next/server";
import { getTopHeadlines } from "@/lib/api";
import { getHiddenNews, hideNews, unhideNews } from "@/lib/hidden-news";
import { isAuthenticated } from "@/lib/auth-check";

// List current RSS headlines for a category, plus everything that's hidden
export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const category = req.nextUrl.searchParams.get("category") || "world";
  const articles = await getTopHeadlines(category, 30);

  return NextResponse.json({
    // Only RSS items here — admin posts are managed on the dashboard
    articles: articles.filter((a) => !a.id.startsWith("custom-")),
    hidden: getHiddenNews(),
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, source } = await req.json();
  if (!id || !title) {
    return NextResponse.json({ error: "id and title are required" }, { status: 400 });
  }
  return NextResponse.json(hideNews({ id, title, source: source || "" }), { status: 201 });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const removed = unhideNews(id);
  if (!removed) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
