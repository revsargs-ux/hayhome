import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rateLimit";
import { jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "hayhome-secret-key-2024");

export async function POST(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const { token, password } = await req.json();

  if (!token || !password || password.length < 6) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Верифицируем токен
  let payload: any;
  try {
    const result = await jwtVerify(token, SECRET);
    payload = result.payload;
  } catch {
    return NextResponse.json({ error: "Token expired or invalid" }, { status: 400 });
  }

  if (payload.purpose !== "reset") {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const { error } = await supabase
    .from("hayhome_users")
    .update({ password: hashedPassword })
    .eq("id", payload.id);

  if (error) {
    return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
