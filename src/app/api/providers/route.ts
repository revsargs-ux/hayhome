import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/providers?ids=id1,id2,id3 — fetch provider names by IDs
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const idsParam = sp.get("ids");

  if (!idsParam) {
    return NextResponse.json({});
  }

  const ids = idsParam.split(",").filter(Boolean);
  if (ids.length === 0) {
    return NextResponse.json({});
  }

  const { data, error } = await supabase
    .from("hayhome_users")
    .select("id, name")
    .in("id", ids)
    .eq("role", "provider");

  if (error) {
    return NextResponse.json({}, { status: 200 });
  }

  const result: Record<string, string> = {};
  for (const row of data || []) {
    result[row.id] = row.name;
  }

  return NextResponse.json(result);
}
