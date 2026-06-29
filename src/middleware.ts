import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) return new TextEncoder().encode("build-placeholder");
  return new TextEncoder().encode(secret);
}

const PROTECTED_ROUTES = ["/dashboard", "/favorites", "/chat"];
const ADMIN_ROUTES = ["/admin"];
const PARTNER_ROUTES = ["/partner/dashboard"];
const PROVIDER_ROUTES = ["/provider/dashboard"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("hayhome_auth")?.value;

  let payload: { role?: string; id?: string } | null = null;
  if (token) {
    try {
      const { payload: verified } = await jwtVerify(token, getSecret());
      payload = verified as unknown as { role?: string; id?: string };
    } catch {
      payload = null;
    }
  }

  // Admin routes
  if (ADMIN_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!payload || payload.role !== "admin") {
      return NextResponse.redirect(new URL("/login?from=" + pathname, req.url));
    }
  }

  // Partner routes
  if (PARTNER_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!payload || !["partner", "admin"].includes(payload.role || "")) {
      return NextResponse.redirect(new URL("/login?from=" + pathname, req.url));
    }
  }

  // Provider routes
  if (PROVIDER_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!payload || !["provider", "admin"].includes(payload.role || "")) {
      return NextResponse.redirect(new URL("/login?from=" + pathname, req.url));
    }
  }

  // Protected routes (any authenticated user)
  if (PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    if (!payload) {
      return NextResponse.redirect(new URL("/login?from=" + pathname, req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/partner/dashboard/:path*",
    "/provider/dashboard/:path*",
    "/favorites/:path*",
    "/chat/:path*",
  ],
};
