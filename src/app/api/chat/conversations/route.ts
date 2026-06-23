import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// GET — list conversations for current user
// Returns last message + unread count per conversation partner
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Fetch all messages where user is sender or receiver (last 500)
  const { data: messages, error } = await supabase
    .from("hayhome_messages")
    .select("*")
    .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`)
    .order("created_at", { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Group by conversation partner
  const convMap = new Map<string, { userId: string; lastMessage: string; lastAt: string; unread: number }>();

  // Collect all user IDs we need to look up names for
  const userIds = new Set<string>();

  for (const msg of messages || []) {
    const partnerId = msg.from_user_id === user.id ? msg.to_user_id : msg.from_user_id;
    userIds.add(partnerId);

    const existing = convMap.get(partnerId);
    if (!existing) {
      convMap.set(partnerId, {
        userId: partnerId,
        lastMessage: msg.text || (msg.media_type ? `[${msg.media_type}]` : ""),
        lastAt: msg.created_at,
        unread: 0,
      });
    }
    // Count unread (messages from partner that are unread)
    if (msg.to_user_id === user.id && !msg.read) {
      convMap.get(partnerId)!.unread++;
    }
  }

  // Fetch user names
  const idsArr = Array.from(userIds);
  let nameMap: Record<string, string> = {};
  if (idsArr.length > 0) {
    const { data: users } = await supabase
      .from("hayhome_users")
      .select("id, name")
      .in("id", idsArr);
    if (users) {
      for (const u of users) nameMap[u.id] = u.name;
    }
  }

  // Also try to get host names via host emails matched to user emails
  const { data: hosts } = await supabase
    .from("hayhome_hosts")
    .select("id, family_name, email, user_id")
    .in("user_id", idsArr);
  if (hosts) {
    for (const h of hosts) {
      if (h.user_id && !nameMap[h.user_id]) nameMap[h.user_id] = h.family_name;
    }
  }

  const result = Array.from(convMap.values()).map(c => ({
    ...c,
    userName: nameMap[c.userId] || c.userId.slice(0, 8),
  }));

  // Sort by last message time desc
  result.sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());

  return NextResponse.json(result);
}
