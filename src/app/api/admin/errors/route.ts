import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// GET /api/admin/errors — list recent errors (admin only)
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const limit = Math.min(Number(req.nextUrl.searchParams.get("limit")) || 50, 200);
  const level = req.nextUrl.searchParams.get("level");

  let query = supabase
    .from("hayhome_errors")
    .select("*")
    .order("timestamp", { ascending: false })
    .limit(limit);

  if (level && ["error", "warn", "info"].includes(level)) {
    query = query.eq("level", level);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE /api/admin/errors — clear all errors (admin only)
export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { error } = await supabase.from("hayhome_errors").delete().neq("id", 0);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, cleared: true });
}
