import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth-check";
import { ADMIN_USERNAME, ADMIN_PASSWORD } from "@/lib/admin-config";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ username: ADMIN_USERNAME });
}

export async function PUT(req: NextRequest) {
  if (!isAuthenticated(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { currentPassword, newPassword } = await req.json();

  if (currentPassword !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
  }
  if (!newPassword || newPassword.length < 6) {
    return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
  }

  // Update .env.local
  const envPath = path.join(process.cwd(), ".env.local");
  if (fs.existsSync(envPath)) {
    let content = fs.readFileSync(envPath, "utf-8");
    content = content.replace(
      /ADMIN_PASSWORD=.*/,
      `ADMIN_PASSWORD=${newPassword}`
    );
    fs.writeFileSync(envPath, content);
  }

  return NextResponse.json({ success: true, message: "Password updated. Restart server to apply." });
}
