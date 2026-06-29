import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const { confirm } = body as { confirm?: string };

  if (confirm !== "DELETE") {
    return NextResponse.json({ error: "Type DELETE in confirm field to proceed" }, { status: 400 });
  }

  try {
    // Anonymize user's reviews
    await supabase
      .from("hayhome_reviews")
      .update({ guestName: "Deleted User", guestEmail: "deleted@hay-home.com" })
      .eq("guestEmail", user.email);

    // Delete user's bookings (or anonymize)
    await supabase
      .from("hayhome_bookings")
      .update({ guestEmail: "deleted@hay-home.com", status: "cancelled" })
      .eq("guestEmail", user.email);

    // Delete user's messages
    await supabase
      .from("hayhome_messages")
      .delete()
      .or(`from_user_id.eq.${user.id},to_user_id.eq.${user.id}`);

    // Delete user's favorites
    await supabase
      .from("hayhome_favorites")
      .delete()
      .eq("user_id", user.id);

    // Delete the user record
    const { error } = await supabase
      .from("hayhome_users")
      .delete()
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }

    // Clear cookie
    const res = NextResponse.json({ ok: true, message: "Account deleted" });
    res.cookies.set("hayhome_auth", "", { maxAge: 0, path: "/" });
    return res;
  } catch (err) {
    console.error("[auth] Account deletion error:", err);
    return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
  }
}
