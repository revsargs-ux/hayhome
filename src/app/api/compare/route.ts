import { NextRequest, NextResponse } from "next/server";
import { getHost } from "@/lib/data";

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  if (ids.length < 1) {
    return NextResponse.json({ error: "At least 1 id required" }, { status: 400 });
  }

  const hosts = await Promise.all(ids.map((id) => getHost(id)));
  const valid = hosts.filter((h) => h !== null);

  return NextResponse.json(valid);
}
