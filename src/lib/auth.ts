import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
      throw new Error("JWT_SECRET environment variable is not set.");
    }
    return new TextEncoder().encode("dev-only-secret-not-for-production");
  }
  return new TextEncoder().encode(secret);
}

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: "guest" | "host" | "admin" | "provider" | "partner";
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(res: NextResponse, token: string): NextResponse {
  res.cookies.set("hayhome_auth", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return res;
}

export function clearAuthCookie(res: NextResponse): NextResponse {
  res.cookies.set("hayhome_auth", "", { maxAge: 0, path: "/" });
  return res;
}

export async function getAuthUser(req: NextRequest): Promise<JWTPayload | null> {
  const token = req.cookies.get("hayhome_auth")?.value;
  if (!token) return null;
  return verifyToken(token);
}
