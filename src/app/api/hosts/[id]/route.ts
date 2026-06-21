import { NextRequest, NextResponse } from "next/server";
import { getHost, updateHost } from "@/lib/data";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const host = await getHost(id);
  if (!host) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(host);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const updates = await req.json();
  const host = await updateHost(id, updates);
  if (!host) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(host);
}
