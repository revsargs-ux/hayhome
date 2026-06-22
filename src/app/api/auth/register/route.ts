import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/data";
import { signToken, setAuthCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import bcrypt from "bcryptjs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 100;

export async function POST(req: NextRequest) {
  // Rate limit
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const body = await req.json();
  const { name, email, password, role } = body;

  // Validation
  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }
  if (typeof name !== "string" || name.length > MAX_NAME) {
    return NextResponse.json({ error: "Name too long" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email) || email.length > 255) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json({ error: "Password too short (min 6)" }, { status: 400 });
  }

  // CRITICAL FIX: never allow "admin" role from public registration
  const safeRole = role === "host" ? "host" : "guest";

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hashedPassword, role: safeRole });

  const token = await signToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const res = NextResponse.json(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    { status: 201 }
  );
  return setAuthCookie(res, token);
}
