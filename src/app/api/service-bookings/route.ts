import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

// GET /api/service-bookings — list bookings (auth required)
export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  let query = supabase
    .from("hayhome_service_bookings")
    .select(`
      *,
      service:hayhome_services(
        id, title, category, price, price_unit, photos, region,
        provider_id
      )
    `)
    .order("created_at", { ascending: false });

  if (user.role === "admin") {
    // Admin sees all
  } else if (user.role === "provider") {
    // Provider sees bookings for their services
    query = query.filter("service.provider_id", "eq", user.id);
  } else {
    // Guest: filter by their bookings — we match via booking.guestEmail
    // Get user's booking IDs first
    const { data: userBookings } = await supabase
      .from("hayhome_bookings")
      .select("id")
      .eq("guestEmail", user.email);

    if (!userBookings || userBookings.length === 0) {
      return NextResponse.json([]);
    }

    const bookingIds = userBookings.map((b: { id: string }) => b.id);
    query = query.in("booking_id", bookingIds);
  }

  const { data, error } = await query.limit(200);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch service bookings" }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}

// POST /api/service-bookings — create (auth required)
export async function POST(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await req.json();

  // Validate
  if (!body.service_id || typeof body.service_id !== "string") {
    return NextResponse.json({ error: "service_id required" }, { status: 400 });
  }
  if (!body.booking_id || typeof body.booking_id !== "string") {
    return NextResponse.json({ error: "booking_id required" }, { status: 400 });
  }
  if (!body.date || typeof body.date !== "string") {
    return NextResponse.json({ error: "date required" }, { status: 400 });
  }

  // Verify service exists and get price
  const { data: service, error: svcError } = await supabase
    .from("hayhome_services")
    .select("id, price, price_unit, min_duration, max_duration, available")
    .eq("id", body.service_id)
    .single();

  if (svcError || !service) {
    return NextResponse.json({ error: "Service not found" }, { status: 404 });
  }
  if (!service.available) {
    return NextResponse.json({ error: "Service not available" }, { status: 400 });
  }

  // Verify booking exists
  const { data: booking } = await supabase
    .from("hayhome_bookings")
    .select("id, checkIn, checkOut, guestEmail, hostId")
    .eq("id", body.booking_id)
    .single();

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  // Verify user owns this booking (or is admin)
  if (booking.guestEmail !== user.email && user.role !== "admin") {
    return NextResponse.json({ error: "Not your booking" }, { status: 403 });
  }

  // Validate date is within booking range
  if (body.date < booking.checkIn || body.date >= booking.checkOut) {
    return NextResponse.json({ error: "Date must be within booking range" }, { status: 400 });
  }

  // Calculate total_price based on price_unit and duration
  const startTime = body.start_time || "10:00";
  const endTime = body.end_time || "12:00";
  let durationHours = 2;
  try {
    const [sh, sm] = startTime.split(":").map(Number);
    const [eh, em] = endTime.split(":").map(Number);
    durationHours = Math.max(0.5, (eh * 60 + em - sh * 60 - sm) / 60);
  } catch { /* default */ }

  let totalPrice = service.price;
  if (service.price_unit === "per_hour") {
    totalPrice = service.price * durationHours;
  } else if (service.price_unit === "per_person") {
    totalPrice = service.price * (body.guests_count || 1);
  }

  const insertData: Record<string, unknown> = {
    booking_id: body.booking_id,
    service_id: body.service_id,
    date: body.date,
    start_time: startTime,
    end_time: endTime,
    guests_count: typeof body.guests_count === "number" ? body.guests_count : 1,
    status: "requested",
    total_price: Math.round(totalPrice * 100) / 100,
    client_note: typeof body.client_note === "string" ? body.client_note.slice(0, 1000) : "",
  };

  // time_of_day: "morning" | "evening" | "custom"
  if (body.time_of_day && ["morning", "evening", "custom"].includes(body.time_of_day)) {
    insertData.time_of_day = body.time_of_day;
    if (body.time_of_day === "custom" && typeof body.custom_time === "string") {
      insertData.custom_time = body.custom_time.slice(0, 100);
    }
  }

  const { data, error } = await supabase
    .from("hayhome_service_bookings")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create service booking" }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}

// PATCH /api/service-bookings — confirm/cancel (auth)
export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await req.json();

  if (!body.id || typeof body.id !== "string") {
    return NextResponse.json({ error: "Booking id required" }, { status: 400 });
  }

  const newStatus = body.status;
  if (!["confirmed", "cancelled", "completed"].includes(newStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Fetch the service booking with service info
  const { data: svcBooking, error: fetchErr } = await supabase
    .from("hayhome_service_bookings")
    .select("id, service_id, booking_id")
    .eq("id", body.id)
    .single();

  if (fetchErr || !svcBooking) {
    return NextResponse.json({ error: "Service booking not found" }, { status: 404 });
  }

  // Get service to check provider
  const { data: service } = await supabase
    .from("hayhome_services")
    .select("provider_id")
    .eq("id", svcBooking.service_id)
    .single();

  // Get booking to check guest
  const { data: booking } = await supabase
    .from("hayhome_bookings")
    .select("guestEmail")
    .eq("id", svcBooking.booking_id)
    .single();

  const isProvider = service && service.provider_id === user.id;
  const isGuest = booking && booking.guestEmail === user.email;
  const isAdmin = user.role === "admin";

  if (!isProvider && !isGuest && !isAdmin) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Permission checks:
  // - Provider can: confirmed, cancelled, completed
  // - Guest can: cancelled only
  // - Admin can: any
  if (isGuest && !isProvider && !isAdmin) {
    if (newStatus !== "cancelled") {
      return NextResponse.json({ error: "Guests can only cancel" }, { status: 403 });
    }
  }

  const { data, error } = await supabase
    .from("hayhome_service_bookings")
    .update({ status: newStatus })
    .eq("id", body.id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }

  return NextResponse.json(data);
}
