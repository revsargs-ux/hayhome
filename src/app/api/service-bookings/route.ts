import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { sendHostNotification, buildServiceEmailHtml } from "@/lib/notify";

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

// POST /api/service-bookings — create
// Two modes:
//   1) Host-tied: requires auth + booking_id
//   2) Standalone: requires guest_name + guest_phone (auth optional)
export async function POST(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const user = await getAuthUser(req);
  const body = await req.json();

  // Validate
  if (!body.service_id || typeof body.service_id !== "string") {
    return NextResponse.json({ error: "service_id required" }, { status: 400 });
  }
  if (!body.date || typeof body.date !== "string") {
    return NextResponse.json({ error: "date required" }, { status: 400 });
  }

  const isStandalone = !body.booking_id;

  // For standalone bookings: require guest_name + guest_phone
  // For host-tied bookings: require auth
  if (isStandalone) {
    if (!body.guest_name || typeof body.guest_name !== "string" || body.guest_name.trim().length === 0) {
      return NextResponse.json({ error: "guest_name required for standalone booking" }, { status: 400 });
    }
    if (!body.guest_phone || typeof body.guest_phone !== "string" || body.guest_phone.trim().length === 0) {
      return NextResponse.json({ error: "guest_phone required for standalone booking" }, { status: 400 });
    }
  } else {
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
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

  // For host-tied bookings: verify booking exists and user owns it
  let booking: { id: string; checkIn: string; checkOut: string; guestEmail: string; hostId: string } | null = null;
  if (!isStandalone) {
    const { data: b } = await supabase
      .from("hayhome_bookings")
      .select("id, checkIn, checkOut, guestEmail, hostId")
      .eq("id", body.booking_id)
      .single();
    booking = b;

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    // Verify user owns this booking (or is admin)
    if (booking.guestEmail !== user!.email && user!.role !== "admin") {
      return NextResponse.json({ error: "Not your booking" }, { status: 403 });
    }

    // Validate date is within booking range
    if (body.date < booking.checkIn || body.date >= booking.checkOut) {
      return NextResponse.json({ error: "Date must be within booking range" }, { status: 400 });
    }
  }

  // Calculate total_price based on price_unit
  const guestsCount = typeof body.guests === "number" ? body.guests : (typeof body.guests_count === "number" ? body.guests_count : 1);
  let totalPrice = service.price;
  if (service.price_unit === "per_person") {
    totalPrice = service.price * guestsCount;
  }

  // Determine start/end time from time_of_day or direct values
  let startTime = body.start_time || "10:00";
  let endTime = body.end_time || "12:00";
  const tod = body.time_of_day;
  if (tod === "morning") {
    startTime = "09:00";
    endTime = "12:00";
  } else if (tod === "evening") {
    startTime = "17:00";
    endTime = "20:00";
  } else if (tod === "custom" && typeof body.custom_time === "string") {
    // Try to parse custom_time like "14:00" or "14:00-16:00"
    const parts = body.custom_time.split("-");
    if (parts.length === 2) {
      startTime = parts[0].trim();
      endTime = parts[1].trim();
    } else {
      startTime = body.custom_time.trim();
    }
  }

  // For per_hour, calculate based on duration
  if (service.price_unit === "per_hour") {
    try {
      const [sh, sm] = startTime.split(":").map(Number);
      const [eh, em] = endTime.split(":").map(Number);
      const durationHours = Math.max(0.5, (eh * 60 + em - sh * 60 - sm) / 60);
      totalPrice = service.price * durationHours;
    } catch { /* keep default */ }
  }

  // ── Check for slot conflicts (prevent double-booking) ──
  const { data: existingBookings } = await supabase
    .from("hayhome_service_bookings")
    .select("id, start_time, end_time, status")
    .eq("service_id", body.service_id)
    .eq("date", body.date)
    .in("status", ["requested", "confirmed"]);

  if (existingBookings && existingBookings.length > 0) {
    const newStart = startTime;
    const newEnd = endTime;
    const conflict = existingBookings.find((b: any) => {
      // Check overlap: existing [b.start_time, b.end_time) vs new [newStart, newEnd)
      return b.start_time < newEnd && b.end_time > newStart;
    });
    if (conflict) {
      return NextResponse.json(
        { error: "This time slot is already booked", conflict: { start: conflict.start_time, end: conflict.end_time } },
        { status: 409 }
      );
    }
  }

  const insertData: Record<string, unknown> = {
    service_id: body.service_id,
    date: body.date,
    start_time: startTime,
    end_time: endTime,
    guests_count: guestsCount,
    status: "requested",
    total_price: Math.round(totalPrice * 100) / 100,
    client_note: typeof body.message === "string" ? body.message.slice(0, 1000)
               : typeof body.client_note === "string" ? body.client_note.slice(0, 1000)
               : "",
  };

  // booking_id (nullable for standalone)
  if (!isStandalone) {
    insertData.booking_id = body.booking_id;
  }

  // Standalone-specific fields
  if (isStandalone) {
    insertData.guest_name = String(body.guest_name).slice(0, 200);
    insertData.guest_phone = String(body.guest_phone).slice(0, 50);
    if (body.payment_method && ["onsite", "transfer"].includes(body.payment_method)) {
      insertData.payment_method = body.payment_method;
    }
  }

  // time_of_day — store in notes if column doesn't exist
  if (tod && ["morning", "evening", "custom"].includes(tod)) {
    const timeDesc = tod === "custom" && body.custom_time ? body.custom_time : tod;
    insertData.notes = (insertData.notes || "") + (insertData.notes ? " | " : "") + "Time: " + timeDesc;
  }

  const { data, error } = await supabase
    .from("hayhome_service_bookings")
    .insert(insertData)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to create service booking: " + error.message }, { status: 500 });
  }

  // ── Notify provider via email + create group chat ──
  try {
    // Get service + provider info
    const { data: svc } = await supabase
      .from("hayhome_services")
      .select("title, provider_id")
      .eq("id", body.service_id)
      .single();

    if (svc?.provider_id) {
      const { data: provider } = await supabase
        .from("hayhome_users")
        .select("id, name, email")
        .eq("id", svc.provider_id)
        .single();

      // Get booking info for context
      let bookingInfo: { guestName?: string; guestEmail?: string; hostName?: string; hostId?: string } | null = null;
      if (!isStandalone && body.booking_id) {
        const { data: b } = await supabase
          .from("hayhome_bookings")
          .select("guestName, guestEmail, hostName, hostId")
          .eq("id", body.booking_id)
          .single();
        bookingInfo = b;
      }

      // Email notification to provider
      if (provider?.email) {
        const { sendServiceBookingNotification } = await import("@/lib/email");
        sendServiceBookingNotification({
          providerName: provider.name || "Provider",
          providerEmail: provider.email,
          serviceTitle: svc.title || "Service",
          date: body.date,
          startTime,
          endTime,
          guestName: isStandalone ? body.guest_name : bookingInfo?.guestName || user!.name,
        }).catch((e) => console.error("[Email] Service booking notification failed:", e));
      }

      // Create group chat: guest + host + provider
      if (!isStandalone && bookingInfo?.hostId) {
        // Get host's user_id and email
        const { data: hostUser } = await supabase
          .from("hayhome_hosts")
          .select("user_id, email, familyName")
          .eq("id", bookingInfo.hostId)
          .single();

        // ── Notify host about service booking ──
        if (hostUser?.email) {
          const guestName = isStandalone ? body.guest_name : bookingInfo?.guestName || user!.name;
          await sendHostNotification(
            hostUser.email,
            `🔔 Новый заказ услуги — ${svc.title || "Service"}`,
            buildServiceEmailHtml({
              guestName,
              serviceTitle: svc.title || "Service",
              date: body.date,
              startTime,
              endTime,
              totalPrice: typeof insertData.total_price === "number" ? insertData.total_price : undefined,
            })
          );
        }

        const participants = [
          user!.id,
          svc.provider_id,
          ...(hostUser?.user_id ? [hostUser.user_id] : []),
        ].filter(Boolean);

        if (participants.length >= 2) {
          // Create group conversation
          const { data: existingConv } = await supabase
            .from("hayhome_messages")
            .select("id")
            .eq("booking_id", body.booking_id)
            .eq("service_id", body.service_id)
            .limit(1);

          if (!existingConv || existingConv.length === 0) {
            // Send system message to start group chat
            const guestName = bookingInfo?.guestName || user!.name;
            await supabase.from("hayhome_messages").insert({
              from_user_id: user!.id,
              to_user_id: svc.provider_id,
              booking_id: body.booking_id || null,
              service_id: body.service_id,
              text: `🔔 ${guestName} заказал услугу «${svc.title}» на ${body.date} (${startTime}-${endTime}). Чат создан для обсуждения деталей.`,
              read: false,
            });
          }
        }
      }
    }
  } catch (notifyErr) {
    console.error("[service-booking] Notification error:", notifyErr);
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
