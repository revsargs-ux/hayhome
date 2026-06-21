import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Routes that require authentication
const PROTECTED = ["/dashboard", "/admin"];
// Routes that require admin role
const ADMIN_ONLY = ["/admin"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("hayhome_auth")?.value;
  const user = token ? await verifyToken(token) : null;

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const needsAdmin = ADMIN_ONLY.some((p) => pathname.startsWith(p));
  if (needsAdmin && user.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
