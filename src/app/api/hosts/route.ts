import { NextRequest, NextResponse } from "next/server";
import { getHosts, createHost } from "@/lib/data";

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all");
  const hosts = await getHosts();
  if (all) return NextResponse.json(hosts);
  return NextResponse.json(hosts.filter((h) => h.status === "active"));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const host = await createHost(body);
  return NextResponse.json(host, { status: 201 });
}
