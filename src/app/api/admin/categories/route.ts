import { NextRequest, NextResponse } from "next/server";
import { getCategories, addCategory, updateCategory, deleteCategory } from "@/lib/admin-db";
import { isAuthenticated } from "@/lib/auth-check";

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getCategories());
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
  const cat = addCategory({
    name: body.name,
    slug: body.name.toLowerCase().replace(/\s+/g, "-"),
    description: body.description || "",
    color: body.color || "#6b7280",
    enabled: body.enabled ?? true,
  });
  return NextResponse.json(cat, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const updated = updateCategory(body.id, body);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  deleteCategory(id);
  return NextResponse.json({ success: true });
}
