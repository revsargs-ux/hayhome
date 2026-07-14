import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

// Routes that require authentication
const PROTECTED = ["/dashboard", "/admin", "/partner/dashboard", "/provider/dashboard"];

// Routes that require specific roles
const ROLE_REQUIRED: Record<string, string[]> = {
  "/admin": ["admin"],
  "/partner/dashboard": ["partner", "admin"],
  "/provider/dashboard": ["provider", "admin"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const needsAuth = PROTECTED.some((p) => pathname.startsWith(p));
  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("hayhome_auth")?.value;
  const user = token ? await verifyToken(token) : null;

  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Check role-based access
  for (const [prefix, roles] of Object.entries(ROLE_REQUIRED)) {
    if (pathname.startsWith(prefix) && !roles.includes(user.role)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/partner/dashboard/:path*", "/provider/dashboard/:path*"],
};
