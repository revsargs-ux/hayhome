import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth";

// GET /api/requests/[id] — single request with responses
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: request, error } = await supabase
    .from("hayhome_guest_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Fetch responses
  const { data: responses, error: respError } = await supabase
    .from("hayhome_request_responses")
    .select("*")
    .eq("request_id", id)
    .order("created_at", { ascending: true });

  if (respError) {
    console.error("[API] GET /requests/[id] responses error:", respError.message);
  }

  return NextResponse.json({ ...request, responses: responses || [] });
}

// PATCH /api/requests/[id] — update status (owner only)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await params;

  const { data: request, error } = await supabase
    .from("hayhome_guest_requests")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !request) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Only owner can update
  if (request.user_id !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const body = await req.json();
  const allowedStatuses = ["open", "accepted", "cancelled", "closed"];
  const newStatus = String(body.status).slice(0, 20);

  if (!allowedStatuses.includes(newStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("hayhome_guest_requests")
    .update({ status: newStatus })
    .eq("id", id)
    .select()
    .single();

  if (updateError || !updated) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json(updated);
}
