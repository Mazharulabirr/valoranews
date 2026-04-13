import { NextRequest, NextResponse } from "next/server";
import { getSettings, updateSettings } from "@/lib/admin-db";
import { isAuthenticated } from "@/lib/auth-check";

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(getSettings());
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  return NextResponse.json(updateSettings(body));
}
