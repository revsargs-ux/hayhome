import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAuthUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

const sb = () =>
  createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const history = await sb()
    .from("hayhome_host_history")
    .select("*")
    .eq("host_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json(history.data || []);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const { id } = await params;
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { action, note } = await req.json();
  if (!action || typeof action !== "string") {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  // Save to history
  const { error } = await sb().from("hayhome_host_history").insert({
    host_id: id,
    action: action,
    actor_id: user.id,
    actor_name: user.name,
    note: (note || "").slice(0, 1000),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // If action is a note, also update admin_notes on the host
  if (action === "note_added") {
    const existing = await sb().from("hayhome_hosts").select("admin_notes").eq("id", id).single();
    const currentNotes = existing.data?.admin_notes || "";
    const updatedNotes = currentNotes
      ? `${currentNotes}\n[${new Date().toISOString().slice(0, 10)}] ${note}`
      : `[${new Date().toISOString().slice(0, 10)}] ${note}`;
    await sb().from("hayhome_hosts").update({ admin_notes: updatedNotes }).eq("id", id);
  }

  return NextResponse.json({ ok: true });
}
