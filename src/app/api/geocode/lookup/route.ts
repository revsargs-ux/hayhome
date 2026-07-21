import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/rateLimit";

// In-memory cache for geocoded cities (lives until server restart)
const GEO_CACHE = new Map<string, { lat: number; lng: number; ts: number }>();
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

export async function GET(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const q = req.nextUrl.searchParams.get("q") || "";
  if (!q || q.trim().length < 2) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const key = q.trim().toLowerCase();

  // Check cache
  const cached = GEO_CACHE.get(key);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return NextResponse.json({ lat: cached.lat, lng: cached.lng, cached: true });
  }

  try {
    const params = new URLSearchParams({
      q: q.trim(),
      format: "json",
      limit: "1",
      addressdetails: "0",
      "accept-language": "ru,en,hy,fr,de,es,it,ar,zh,fa",
    });

    const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
      headers: { "User-Agent": "HayHome/1.0 (hay-home.com)" },
      next: { revalidate: 86400 }, // Next.js cache 24h
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Geocode failed" }, { status: 502 });
    }

    const data = await res.json() as Array<{ lat: string; lon: string }>;

    if (data.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);

    // Save to cache
    GEO_CACHE.set(key, { lat, lng, ts: Date.now() });

    // Cleanup old cache entries (>48h old, max 5000 entries)
    if (GEO_CACHE.size > 5000) {
      const cutoff = Date.now() - 48 * 60 * 60 * 1000;
      for (const [k, v] of GEO_CACHE) {
        if (v.ts < cutoff) GEO_CACHE.delete(k);
      }
    }

    return NextResponse.json({ lat, lng, cached: false });
  } catch {
    return NextResponse.json({ error: "Geocode error" }, { status: 502 });
  }
}
