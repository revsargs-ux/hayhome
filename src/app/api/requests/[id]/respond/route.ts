import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

// POST /api/requests/[id]/respond — organizer responds (auth required)
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (user.role !== "host" && user.role !== "provider" && user.role !== "admin") {
    return NextResponse.json({ error: "Host or provider role required" }, { status: 403 });
  }

  const { id } = await params;

  // Check request exists and is open
  const { data: request, error } = await supabase
    .from("hayhome_guest_requests")
    .select("id, status, user_id")
    .eq("id", id)
    .single();

  if (error || !request) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (request.status !== "open") {
    return NextResponse.json({ error: "Request is not open" }, { status: 400 });
  }

  const body = await req.json();

  if (!body.message || typeof body.message !== "string" || body.message.trim().length === 0) {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  const insertData = {
    id: Date.now().toString() + Math.random().toString(36).slice(2, 8),
    request_id: id,
    user_id: user.id,
    message: String(body.message).slice(0, 2000),
    price: body.price ? String(body.price).slice(0, 200) : null,
    status: "pending",
  };

  const { data, error: insertError } = await supabase
    .from("hayhome_request_responses")
    .insert(insertData)
    .select()
    .single();

  if (insertError || !data) {
    console.error("[API] POST /requests/[id]/respond error:", insertError?.message);
    return NextResponse.json({ error: "Failed to submit response" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
