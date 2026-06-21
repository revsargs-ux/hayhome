import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail, createUser } from "@/lib/data";

export async function POST(req: NextRequest) {
  const { name, email, password, role } = await req.json();
  const existing = await getUserByEmail(email);
  if (existing) {
    return NextResponse.json({ error: "Email уже используется" }, { status: 400 });
  }
  const user = await createUser({ name, email, password, role: role || "guest" });
  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 });
}
