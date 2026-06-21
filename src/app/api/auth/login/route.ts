import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/data";
import { signToken, setAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const user = await getUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  // Support both bcrypt hashed and legacy plaintext passwords
  let valid = false;
  if (user.password.startsWith("$2")) {
    valid = await bcrypt.compare(password, user.password);
  } else {
    valid = user.password === password;
  }

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
