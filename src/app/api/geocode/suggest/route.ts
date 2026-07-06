import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const q = req.nextUrl.searchParams.get("q") || "";
  const lang = req.nextUrl.searchParams.get("lang") || "en";
  const type = req.nextUrl.searchParams.get("type") || "address"; // "city" | "address"

  if (!q || q.trim().length < 2) return NextResponse.json({ results: [] });

  const acceptLang = {
    ru: "ru,en", hy: "hy,en", ar: "ar,en", fa: "fa,en",
    zh: "zh,en", de: "de,en", fr: "fr,en", es: "es,en", it: "it,en",
  }[lang] || "en";

  const params = new URLSearchParams({
    q: q.trim(),
    format: "json",
    limit: "6",
    addressdetails: "1",
    "accept-language": acceptLang,
  });
  if (type === "city") params.set("featuretype", "city");

  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { "User-Agent": "HayHome/1.0 (hayhome.am)" },
      next: { revalidate: 300 },
    });
    if (!res.ok) return NextResponse.json({ results: [] });
    const data = await res.json();
    return NextResponse.json({
      results: (data as Array<{ display_name: string; lat: string; lon: string; type: string }>)
        .map(({ display_name, lat, lon, type: t }) => ({ display_name, lat, lon, type: t })),
    });
  } catch {
    return NextResponse.json({ results: [] });
  }
}
