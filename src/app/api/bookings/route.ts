import { NextRequest, NextResponse } from "next/server";
import { getBookings, createBooking } from "@/lib/data";
import { getAuthUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { sendBookingNotification } from "@/lib/email";
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

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function GET(req: NextRequest) {
  // Auth required — only user's own bookings
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const hostId = req.nextUrl.searchParams.get("hostId") ?? undefined;
  const bookings = await getBookings(hostId);

  // Filter: admin sees all, others see only their own
  const filtered = user.role === "admin"
    ? bookings
    : bookings.filter((b: any) => b.guestEmail === user.email);

  return NextResponse.json(filtered);
}

export async function POST(req: NextRequest) {
  // Rate limit
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  // Auth required to book
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await req.json();

  // Validation
  if (!body.hostId || typeof body.hostId !== "string") {
    return NextResponse.json({ error: "hostId required" }, { status: 400 });
  }
  if (!body.checkIn || !body.checkOut || typeof body.checkIn !== "string" || typeof body.checkOut !== "string") {
    return NextResponse.json({ error: "checkIn and checkOut required" }, { status: 400 });
  }
  if (!body.guests || typeof body.guests !== "number" || body.guests < 1 || body.guests > 20) {
    return NextResponse.json({ error: "Invalid guest count" }, { status: 400 });
  }
  if (typeof body.totalPrice !== "number" || body.totalPrice < 0 || body.totalPrice > 100000) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }
  if (body.message && typeof body.message === "string" && body.message.length > 2000) {
    return NextResponse.json({ error: "Message too long" }, { status: 400 });
  }

  // ── Calendar availability check ──
  const dateRange = getDateRange(body.checkIn, body.checkOut);
  if (dateRange.length > 0) {
    const { data: calendarEntries } = await supabase
      .from("hayhome_calendar")
      .select("date, status")
      .eq("host_id", body.hostId)
      .in("date", dateRange);

    if (calendarEntries && calendarEntries.length > 0) {
      const unavailable = calendarEntries.filter(
        (e: any) => e.status === "booked" || e.status === "blocked"
      );
      if (unavailable.length > 0) {
        return NextResponse.json(
          { error: "Some dates are not available", unavailableDates: unavailable.map((e: any) => e.date) },
          { status: 409 }
        );
      }
    }
  }

  const booking = await createBooking({
    hostId: body.hostId,
    hostName: String(body.hostName || "").slice(0, 200),
    guestName: user.name,
    guestEmail: user.email,
    guestPhone: String(body.guestPhone || "").slice(0, 50),
    guestCountry: String(body.guestCountry || "").slice(0, 100),
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    guests: body.guests,
    totalPrice: body.totalPrice,
    message: String(body.message || "").slice(0, 2000),
  });

  // ── Mark calendar dates as booked ──
  if (dateRange.length > 0) {
    const calendarRows = dateRange.map((d) => ({
      host_id: body.hostId,
      date: d,
      status: "booked",
      booking_id: booking.id,
    }));
    await supabase
      .from("hayhome_calendar")
      .upsert(calendarRows, { onConflict: "host_id,date" });
  }

  // Email notification (async, non-blocking)
  sendBookingNotification({
    guestName: booking.guestName,
    guestEmail: booking.guestEmail,
    guestPhone: booking.guestPhone,
    guestCountry: booking.guestCountry,
    hostName: booking.hostName,
    checkIn: booking.checkIn,
    checkOut: booking.checkOut,
    guests: booking.guests,
    totalPrice: booking.totalPrice,
    message: booking.message,
  }).catch((err) => console.error("[Email] Booking notification failed:", err));

  // Partner commission (async, non-blocking)
  (async () => {
    try {
      const { createClient } = require("@supabase/supabase-js");
      const sb = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      // Check if guest was referred
      const { data: guestUser } = await sb.from("hayhome_users").select("referred_by_code, referred_by").eq("id", user.id).single();
      if (guestUser?.referred_by_code) {
        const { data: partner } = await sb.from("hayhome_partners").select("id, status").eq("code", guestUser.referred_by_code).eq("status", "active").single();
        if (partner) {
          const commission = Math.round(booking.totalPrice * 0.05 * 100) / 100;
          // Update booking with commission
          await sb.from("hayhome_bookings").update({ commission_partner: commission, partner_id: partner.id }).eq("id", booking.id);
          // Check/create referral record
          const { data: ref } = await sb.from("hayhome_referrals").select("id, first_booking_at").eq("partner_id", partner.id).eq("referred_user_id", user.id).single();
          if (ref) {
            if (!ref.first_booking_at) {
              await sb.from("hayhome_referrals").update({ first_booking_at: new Date().toISOString(), expires_at: new Date(Date.now() + 2 * 365.25 * 24 * 60 * 60 * 1000).toISOString() }).eq("id", ref.id);
            } else if (new Date(ref.expires_at) > new Date()) {
              // Still within 2-year window — credit partner
              await sb.from("hayhome_partners").update({ balance: 0, total_earned: 0 }).eq("id", partner.id);
              const { data: p } = await sb.from("hayhome_partners").select("balance, total_earned").eq("id", partner.id).single();
              if (p) {
                await sb.from("hayhome_partners").update({ balance: p.balance + commission, total_earned: p.total_earned + commission }).eq("id", partner.id);
              }
            }
          }
          console.log(`[Partner] Commission $${commission} credited to ${partner.id}`);
        }
      }
    } catch (e) { console.warn("[Partner] Commission error:", e); }
  })();

  return NextResponse.json(booking, { status: 201 });
}
