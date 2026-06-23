import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

const VALID_CATEGORIES = ["photo", "video", "music", "costume", "decor", "dance", "guide", "chef", "custom"];
const VALID_UNITS = ["per_hour", "per_event", "per_person"];

// GET /api/services?category=X&region=Y  — public list
// GET /api/services?provider=X           — list by provider
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const category = sp.get("category");
  const region = sp.get("region");
  const provider = sp.get("provider");
  const search = sp.get("search");

  let query = supabase
    .from("hayhome_services")
    .select("*")
    .order("created_at", { ascending: false });

  if (provider) {
    // Handle "me" — need auth
    if (provider === "me") {
      const user = await getAuthUser(req);
      if (!user) {
        return NextResponse.json({ error: "Auth required" }, { status: 401 });
      }
      query = query.eq("provider_id", user.id);
    } else if (provider === "all") {
      // Admin/provider listing — return all (no filter)
    } else {
      query = query.eq("provider_id", provider);
    }
  } else {
    // Public listing: only available services
    query = query.eq("available", true);
    if (category && VALID_CATEGORIES.includes(category)) {
      query = query.eq("category", category);
    }
    if (region && region !== "all") {
      query = query.eq("region", region);
    }
    if (search) {
      query = query.ilike("title", `%${search}%`);
    }
  }

  const { data, error } = await query.limit(100);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// POST /api/services — create (provider only)
export async function POST(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (user.role !== "provider" && user.role !== "admin") {
    return NextResponse.json({ error: "Provider role required" }, { status: 403 });
  }

  const body = await req.json();

  // Validate
  if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!body.category || !VALID_CATEGORIES.includes(body.category)) {
    return NextResponse.json({ error: "Valid category is required" }, { status: 400 });
  }
  if (typeof body.price !== "number" || body.price < 0 || body.price > 100000) {
    return NextResponse.json({ error: "Valid price is required" }, { status: 400 });
  }
  if (body.price_unit && !VALID_UNITS.includes(body.price_unit)) {
    return NextResponse.json({ error: "Invalid price_unit" }, { status: 400 });
  }

  const insertData: Record<string, unknown> = {
    provider_id: user.id,
    category: String(body.category),
    title: String(body.title).slice(0, 200),
    description: typeof body.description === "string" ? body.description.slice(0, 2000) : "",
    price: body.price,
    price_unit: body.price_unit || "per_event",
    min_duration: typeof body.min_duration === "number" ? body.min_duration : 1,
    max_duration: typeof body.max_duration === "number" ? body.max_duration : 8,
    photos: Array.isArray(body.photos) ? body.photos.slice(0, 10) : [],
    region: typeof body.region === "string" ? body.region.slice(0, 100) : "",
    available: body.available !== false,
  };

  const { data, error } = await supabase
    .from("hayhome_services")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/services — update own service
export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (user.role !== "provider" && user.role !== "admin") {
    return NextResponse.json({ error: "Provider role required" }, { status: 403 });
  }

  const body = await req.json();

  if (!body.id || typeof body.id !== "string") {
    return NextResponse.json({ error: "Service id required" }, { status: 400 });
  }

  // Check ownership
  const { data: existing } = await supabase
    .from("hayhome_services")
    .select("provider_id")
    .eq("id", body.id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }
  if (existing.provider_id !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const updates: Record<string, unknown> = {};
  const allowed = ["title", "description", "price", "price_unit", "min_duration", "max_duration", "photos", "region", "available", "category"];
  for (const field of allowed) {
    if (body[field] !== undefined) {
      updates[field] = body[field];
    }
  }

  if (updates.category && !VALID_CATEGORIES.includes(updates.category as string)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }
  if (updates.price_unit && !VALID_UNITS.includes(updates.price_unit as string)) {
    return NextResponse.json({ error: "Invalid price_unit" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("hayhome_services")
    .update(updates)
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/services?id=X — delete own service
export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (user.role !== "provider" && user.role !== "admin") {
    return NextResponse.json({ error: "Provider role required" }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Service id required" }, { status: 400 });
  }

  // Check ownership
  const { data: existing } = await supabase
    .from("hayhome_services")
    .select("provider_id")
    .eq("id", id)
    .single();

  if (!existing) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }
  if (existing.provider_id !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const { error } = await supabase
    .from("hayhome_services")
    .delete()
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
