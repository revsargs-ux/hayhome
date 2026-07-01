import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// POST /api/requests/recommend — get matching services and hosts
// Body: { title, description, region }
export async function POST(req: NextRequest) {
  const body = await req.json();

  const title = (body.title || "").toString().toLowerCase();
  const description = (body.description || "").toString().toLowerCase();
  const region = (body.region || "").toString();
  const category = (body.category || "").toString();

  const searchText = `${title} ${description}`;

  // Build service query
  let serviceQuery = supabase
    .from("hayhome_services")
    .select("*")
    .eq("available", true);

  // Filter by category if provided
  if (category && category !== "custom") {
    serviceQuery = serviceQuery.eq("category", category);
  }

  // Filter by region if provided
  if (region && region !== "all") {
    serviceQuery = serviceQuery.eq("region", region);
  }

  serviceQuery = serviceQuery.limit(10);

  const { data: services, error: serviceError } = await serviceQuery;

  if (serviceError) {
    console.error("[API] recommend services error:", serviceError.message);
  }

  // If no category match, try keyword search in title
  let finalServices = services || [];
  if ((!finalServices || finalServices.length === 0) && title) {
    const { data: kwServices } = await supabase
      .from("hayhome_services")
      .select("*")
      .eq("available", true)
      .ilike("title", `%${title.slice(0, 50)}%`)
      .limit(10);
    finalServices = kwServices || [];
  }

  // Build hosts query
  let hostQuery = supabase
    .from("hayhome_hosts")
    .select("id, familyName, pricePerNight, region, city, coverPhoto, rating, reviewCount, maxGuests")
    .eq("status", "active");

  if (region && region !== "all") {
    hostQuery = hostQuery.eq("region", region);
  }

  hostQuery = hostQuery.order("rating", { ascending: false }).limit(6);

  const { data: hosts, error: hostError } = await hostQuery;

  if (hostError) {
    console.error("[API] recommend hosts error:", hostError.message);
  }

  return NextResponse.json({
    services: finalServices || [],
    hosts: hosts || [],
  });
}
