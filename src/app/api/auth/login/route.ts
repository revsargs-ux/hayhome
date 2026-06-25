import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/data";
import { signToken, setAuthCookie } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import bcrypt from "bcryptjs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  // Rate limit
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const { email, password } = await req.json();

  if (!email || !password || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Only bcrypt hashed passwords are allowed
  const valid = await bcrypt.compare(password, user.password);

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signToken({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const res = NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  return setAuthCookie(res, token);
}
