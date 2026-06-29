import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  // Fetch all active hosts
  const { data: hosts, error } = await supabase
    .from("hayhome_hosts")
    .select("id, family_name, price_per_night, rating, review_count, city, region, cover_photo, stars")
    .eq("status", "active");

  if (error || !hosts) {
    return NextResponse.json({ error: "Failed to fetch hosts" }, { status: 500 });
  }

  // Filter out hosts with no price or rating
  const validHosts = hosts.filter((h: any) => h.price_per_night > 0);

  if (validHosts.length === 0) {
    return NextResponse.json([]);
  }

  // Calculate average price
  const avgPrice = validHosts.reduce((sum: number, h: any) => sum + h.price_per_night, 0) / validHosts.length;

  // Calculate value score: rating / (price / avgPrice) × 10
  // Higher rating + lower price = higher score
  const scored = validHosts.map((h: any) => {
    const priceRatio = h.price_per_night / avgPrice;
    const rating = h.rating || 0;
    const score = priceRatio > 0 ? (rating / priceRatio) * 10 : 0;
    return {
      id: h.id,
      family_name: h.family_name,
      price_per_night: h.price_per_night,
      rating: rating,
      review_count: h.review_count || 0,
      city: h.city,
      region: h.region,
      cover_photo: h.cover_photo,
      stars: h.stars,
      value_score: Math.round(score * 100) / 100,
      rank: 0, // will be set after sorting
    };
  });

  // Sort by value score descending
  scored.sort((a: any, b: any) => b.value_score - a.value_score);

  // Assign ranks
  scored.forEach((h: any, idx: number) => {
    h.rank = idx + 1;
  });

  return NextResponse.json(scored);
}
