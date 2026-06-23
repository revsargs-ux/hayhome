import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// GET — all conversations (admin only)
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (user.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { data: messages, error } = await supabase
    .from("hayhome_messages")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1000);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Group by conversation pair (from_user_id <-> to_user_id)
  const convMap = new Map<string, { fromUserId: string; toUserId: string; fromUserName: string; toUserName: string; lastMessage: string; lastAt: string; bookingId: string | null; msgCount: number }>();

  const userIds = new Set<string>();
  for (const msg of messages || []) {
    userIds.add(msg.from_user_id);
    userIds.add(msg.to_user_id);

    const pairKey = [msg.from_user_id, msg.to_user_id].sort().join("|");
    const existing = convMap.get(pairKey);

    if (!existing || new Date(msg.created_at) > new Date(existing.lastAt)) {
      convMap.set(pairKey, {
        fromUserId: msg.from_user_id,
        toUserId: msg.to_user_id,
        fromUserName: msg.from_user_id.slice(0, 8),
        toUserName: msg.to_user_id.slice(0, 8),
        lastMessage: msg.text || (msg.media_type ? `[${msg.media_type}]` : ""),
        lastAt: msg.created_at,
        bookingId: msg.booking_id,
        msgCount: (existing?.msgCount || 0) + 1,
      });
    } else {
      existing.msgCount++;
    }
  }

  // Fetch user names
  const idsArr = Array.from(userIds);
  if (idsArr.length > 0) {
    const { data: users } = await supabase
      .from("hayhome_users")
      .select("id, name")
      .in("id", idsArr);
    const nameMap: Record<string, string> = {};
    if (users) for (const u of users) nameMap[u.id] = u.name;

    for (const conv of convMap.values()) {
      conv.fromUserName = nameMap[conv.fromUserId] || conv.fromUserId.slice(0, 8);
      conv.toUserName = nameMap[conv.toUserId] || conv.toUserId.slice(0, 8);
    }
  }

  const result = Array.from(convMap.values()).sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
  return NextResponse.json(result);
}
