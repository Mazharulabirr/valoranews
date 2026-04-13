import { NextRequest, NextResponse } from "next/server";
import { getSubscribers, addSubscriber, deleteSubscriber, toggleSubscriber } from "@/lib/admin-db";
import { isAuthenticated } from "@/lib/auth-check";

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getSubscribers());
}

export async function POST(req: NextRequest) {
  // Public endpoint for newsletter signup
  const body = await req.json();
  if (!body.email) return NextResponse.json({ error: "Email required" }, { status: 400 });
  const sub = addSubscriber(body.email);
  if (!sub) return NextResponse.json({ error: "Already subscribed" }, { status: 409 });
  return NextResponse.json(sub, { status: 201 });
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const updated = toggleSubscriber(body.id);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });
  deleteSubscriber(id);
  return NextResponse.json({ success: true });
}
