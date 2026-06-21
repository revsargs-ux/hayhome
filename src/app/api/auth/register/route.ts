import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/data";
import { signToken, setAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const { name, email, password, role = "guest" } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "All fields required" }, { status: 400 });
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password too short" }, { status: 400 });
  }

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hashedPassword, role });

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
