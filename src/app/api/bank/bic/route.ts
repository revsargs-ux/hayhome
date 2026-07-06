import { NextRequest, NextResponse } from "next/server";
import { SWIFT_BANKS, searchBanks } from "@/lib/swiftBanks";

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ results: [] });

  // Exact BIC lookup first
  const exact = SWIFT_BANKS[q.toUpperCase()];
  if (exact) return NextResponse.json({ results: [{ bic: q.toUpperCase(), ...exact }] });

  // Partial search
  return NextResponse.json({ results: searchBanks(q) });
}
