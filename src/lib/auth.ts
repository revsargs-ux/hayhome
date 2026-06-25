import { SignJWT, jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

const _jwtSecret = process.env.JWT_SECRET;
if (!_jwtSecret) {
  throw new Error("JWT_SECRET environment variable is not set. Refusing to start.");
}
const SECRET = new TextEncoder().encode(_jwtSecret);

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: "guest" | "host" | "admin" | "provider";
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
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
