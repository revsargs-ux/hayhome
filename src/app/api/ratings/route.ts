import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  // Fetch all active hosts (DB uses camelCase columns)
  const { data: hosts, error } = await supabase
    .from("hayhome_hosts")
    .select("id, familyName, rating, reviewCount, city, region, coverPhoto, stars")
    .eq("status", "active");

  if (error || !hosts) {
    return NextResponse.json({ error: "Failed to fetch hosts" }, { status: 500 });
  }

  // Value score based purely on rating (stay is free)
  const scored = hosts.map((h: any) => {
    const rating = h.rating || 0;
    const score = rating * 10;
    return {
      id: h.id,
      family_name: h.familyName,
      rating: rating,
      review_count: h.reviewCount || 0,
      city: h.city,
      region: h.region,
      cover_photo: h.coverPhoto,
      stars: h.stars,
      value_score: Math.round(score * 100) / 100,
      rank: 0,
    };
  });

  scored.sort((a: any, b: any) => b.value_score - a.value_score);
  scored.forEach((h: any, idx: number) => { h.rank = idx + 1; });

  return NextResponse.json(scored);
}
