import { NextRequest } from "next/server";
import { ADMIN_SECRET } from "./admin-config";

export function isAuthenticated(req: NextRequest): boolean {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    return decoded.startsWith(ADMIN_SECRET + ":");
  } catch {
    return false;
  }
}
