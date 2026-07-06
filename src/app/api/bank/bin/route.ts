import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const bin = (req.nextUrl.searchParams.get("bin") || "").replace(/\D/g, "").slice(0, 8);
  if (bin.length < 6) return NextResponse.json({ error: "Need at least 6 digits" }, { status: 400 });

  try {
    const res = await fetch(`https://lookup.binlist.net/${bin}`, {
      headers: { "Accept-Version": "3" },
      next: { revalidate: 86400 },
    });
    if (!res.ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
    const d = await res.json() as {
      bank?: { name?: string };
      scheme?: string;
      type?: string;
      country?: { name?: string; alpha2?: string };
    };
    return NextResponse.json({
      bank: d.bank?.name || null,
      scheme: d.scheme || null,
      type: d.type || null,
      country: d.country?.name || null,
      countryCode: d.country?.alpha2 || null,
    });
  } catch {
    return NextResponse.json({ error: "Lookup failed" }, { status: 503 });
  }
}
