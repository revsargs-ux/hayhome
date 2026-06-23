import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rateLimit";

// GET — chat history
// ?with=userId  → messages between current user and that user
// ?bookingId=X  → messages for a booking (all participants)
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const withUserId = searchParams.get("with");
  const bookingId = searchParams.get("bookingId");

  let query = supabase.from("hayhome_messages").select("*").order("created_at", { ascending: true }).limit(500);

  if (bookingId) {
    query = query.eq("booking_id", bookingId);
  } else if (withUserId) {
    // Messages between current user and withUserId (both directions)
    query = query.or(`and(from_user_id.eq.${user.id},to_user_id.eq.${withUserId}),and(from_user_id.eq.${withUserId},to_user_id.eq.${user.id})`);
  } else {
    return NextResponse.json({ error: "Provide 'with' or 'bookingId' parameter" }, { status: 400 });
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Mark messages from the other user as read
  if (withUserId && data) {
    const unreadIds = data.filter(m => m.to_user_id === user.id && !m.read).map(m => m.id);
    if (unreadIds.length > 0) {
      await supabase.from("hayhome_messages").update({ read: true }).in("id", unreadIds);
    }
  }

  return NextResponse.json(data || []);
}

// POST — send a message
export async function POST(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { to_user_id, text, booking_id, media_url, media_type, service_id } = body;

  if (!to_user_id) return NextResponse.json({ error: "to_user_id is required" }, { status: 400 });
  if (!text && !media_url) return NextResponse.json({ error: "text or media_url is required" }, { status: 400 });

  const messageText = typeof text === "string" ? text.slice(0, 5000) : "";
  const mediaUrl = typeof media_url === "string" ? media_url.slice(0, 1000) : "";
  const mediaType = typeof media_type === "string" ? media_type.slice(0, 20) : "";

  const { data, error } = await supabase.from("hayhome_messages").insert({
    from_user_id: user.id,
    to_user_id,
    booking_id: booking_id || null,
    service_id: service_id || null,
    text: messageText,
    media_url: mediaUrl,
    media_type: mediaType,
    read: false,
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
