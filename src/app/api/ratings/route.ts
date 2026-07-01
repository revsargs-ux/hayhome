import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  // Fetch all active hosts (DB uses camelCase columns)
  const { data: hosts, error } = await supabase
    .from("hayhome_hosts")
    .select("id, familyName, pricePerNight, rating, reviewCount, city, region, coverPhoto, stars")
    .eq("status", "active");

  if (error || !hosts) {
    return NextResponse.json({ error: "Failed to fetch hosts" }, { status: 500 });
  }

  // Filter out hosts with no price
  const validHosts = hosts.filter((h: any) => h.pricePerNight > 0);

  if (validHosts.length === 0) {
    return NextResponse.json([]);
  }

  // Calculate average price
  const avgPrice = validHosts.reduce((sum: number, h: any) => sum + h.pricePerNight, 0) / validHosts.length;

  // Calculate value score
  const scored = validHosts.map((h: any) => {
    const priceRatio = h.pricePerNight / avgPrice;
    const rating = h.rating || 0;
    const score = priceRatio > 0 ? (rating / priceRatio) * 10 : 0;
    return {
      id: h.id,
      family_name: h.familyName,
      price_per_night: h.pricePerNight,
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
