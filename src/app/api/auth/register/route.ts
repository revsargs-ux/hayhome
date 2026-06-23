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

  // Allow "host" and "provider" roles, block "admin"
  const safeRole = role === "host" ? "host" : role === "provider" ? "provider" : "guest";

  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await createUser({ name, email, password: hashedPassword, role: safeRole });

  // Реферальный код — если пришёл по ссылке партнёра
  const refCode = body.ref || body.referred_by_code || null;
  if (refCode) {
    try {
      const { createClient } = await import("@supabase/supabase-js");
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      const { data: partner } = await sb.from("hayhome_partners").select("id, user_id").eq("code", refCode).single();
      if (partner && partner.user_id !== user.id) {
        await sb.from("hayhome_users").update({ referred_by_code: refCode, referred_by: partner.user_id }).eq("id", user.id);
      }
    } catch (e) { console.warn("[Referral] Failed to record referral:", e); }
  }

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
