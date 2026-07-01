import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

// GET /api/requests — list open requests (public). Filters: ?category, ?region
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const category = sp.get("category");
  const region = sp.get("region");

  let query = supabase
    .from("hayhome_guest_requests")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (category && category !== "all") {
    query = query.eq("category", category);
  }
  if (region && region !== "all") {
    query = query.eq("region", region);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[API] GET /requests error:", error.message);
    return NextResponse.json({ error: "Failed to fetch requests" }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// POST /api/requests — create a request (auth required)
export async function POST(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await req.json();

  // Validate required fields
  if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!body.description || typeof body.description !== "string" || body.description.trim().length === 0) {
    return NextResponse.json({ error: "description is required" }, { status: 400 });
  }

  const insertData = {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
    user_id: user.id,
    title: String(body.title).slice(0, 200),
    description: String(body.description).slice(0, 3000),
    category: body.category ? String(body.category).slice(0, 50) : null,
    region: body.region ? String(body.region).slice(0, 100) : null,
    date_from: body.date_from ? String(body.date_from).slice(0, 20) : null,
    date_to: body.date_to ? String(body.date_to).slice(0, 20) : null,
    guests_count: typeof body.guests_count === "number" ? Math.min(Math.max(body.guests_count, 1), 100) : 1,
    budget: body.budget ? String(body.budget).slice(0, 200) : null,
    status: "open",
  };

  const { data, error } = await supabase
    .from("hayhome_guest_requests")
    .insert(insertData)
    .select()
    .single();

  if (error || !data) {
    console.error("[API] POST /requests error:", error?.message);
    return NextResponse.json({ error: "Failed to create request" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
