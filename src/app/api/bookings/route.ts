import { NextRequest, NextResponse } from "next/server";
import { getBookings, createBooking } from "@/lib/data";
import { getAuthUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { sendBookingNotification } from "@/lib/email";

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

  return NextResponse.json(booking, { status: 201 });
}
