import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// GET — count unread messages for current user, grouped by sender
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("hayhome_messages")
    .select("from_user_id")
    .eq("to_user_id", user.id)
    .eq("read", false);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Group by sender
  const counts: Record<string, number> = {};
  let total = 0;
  for (const row of data || []) {
    counts[row.from_user_id] = (counts[row.from_user_id] || 0) + 1;
    total++;
  }

  return NextResponse.json({ total, bySender: counts });
}
