import { NextRequest, NextResponse } from "next/server";
import { updateBooking } from "@/lib/data";
import { getAuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// Helper: get all dates between checkIn and checkOut (exclusive of checkOut)
function getDateRange(checkIn: string, checkOut: string): string[] {
  const dates: string[] = [];
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const cur = new Date(start);
  while (cur < end) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

const ALLOWED_STATUSES = ["pending", "confirmed", "cancelled", "completed"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // Ownership check
  if (user.role === "guest") {
    // Guest: only their own bookings
    const { data: existing } = await supabase
      .from("hayhome_bookings")
      .select("guest_email, guest_id")
      .eq("id", id)
      .single();
    if (!existing || (existing.guest_email !== user.email && existing.guest_id !== user.id)) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
  } else if (user.role === "host") {
    // Host: only bookings for their hosts
    const { data: existing } = await supabase
      .from("hayhome_bookings")
      .select("host_id")
      .eq("id", id)
      .single();
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const { data: host } = await supabase
      .from("hayhome_hosts")
      .select("user_id")
      .eq("id", existing.host_id)
      .single();
    if (!host || host.user_id !== user.id) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
  }
  // Admin: can modify any booking

  const body = await req.json();

  // Only allow status updates
  const updates: Record<string, unknown> = {};
  if (body.status) {
    if (!ALLOWED_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }
    updates.status = body.status;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const booking = await updateBooking(id, updates);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // ── On cancellation: free up calendar dates ──
  if (body.status === "cancelled") {
    // Fetch the booking to get date range
    const { data: fullBooking } = await supabase
      .from("hayhome_bookings")
      .select("host_id, checkIn, checkOut")
      .eq("id", id)
      .single();

    if (fullBooking) {
      const dateRange = getDateRange(fullBooking.checkIn, fullBooking.checkOut);
      if (dateRange.length > 0) {
        const restoreRows = dateRange.map((d) => ({
          host_id: fullBooking.host_id,
          date: d,
          status: "available",
          booking_id: null,
          note: null,
        }));
        await supabase
          .from("hayhome_calendar")
          .upsert(restoreRows, { onConflict: "host_id,date" });
      }
    }
  }

  return NextResponse.json(booking);
}
