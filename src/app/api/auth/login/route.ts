import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/data";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const user = await getUserByEmail(email);
  if (!user || user.password !== password) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
