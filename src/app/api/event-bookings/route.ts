import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { eventId, eventName, guestName, guestPhone, guestEmail, guests, date } = body;

    if (!eventId || !guestName || !guestPhone || !guests || !date) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Insert — try hayhome_event_bookings first, fallback to hayhome_bookings
    let result: Record<string, unknown> | null = null;
    let error: { code?: string; message?: string } | null = null;
    let usedTable = "hayhome_event_bookings";

    ({ data: result, error } = await supabase
      .from("hayhome_event_bookings")
      .insert({
        eventId,
        eventName,
        guestName,
        guestPhone,
        guestEmail: guestEmail || null,
        guests: Number(guests),
        date,
        status: "pending",
      })
      .select()
      .single());

    if (error && error.code === "42P01") {
      // Table doesn't exist — use hayhome_bookings as fallback
      usedTable = "hayhome_bookings";
      const fb = await supabase
        .from("hayhome_bookings")
        .insert({
          hostId: eventId,
          guestName,
          guestPhone,
          guestEmail: guestEmail || null,
          checkIn: date,
          checkOut: date,
          guests: Number(guests),
          status: "pending",
          totalPrice: 0,
        })
        .select()
        .single();
      if (fb.error) return NextResponse.json({ error: fb.error.message }, { status: 500 });
      result = fb.data;
    } else if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send notification to host if notify module exists
    try {
      const { sendHostNotification } = await import("@/lib/notify");
      await sendHostNotification(
        "revik@hay-home.com",
        `Новое бронирование: ${eventName}`,
        `<h2>Бронирование события</h2>
        <p><b>${guestName}</b> забронировал(а) <b>${eventName}</b></p>
        <p>📅 Дата: ${date}</p>
        <p>👥 Количество: ${guests} чел.</p>
        <p>📞 Телефон: ${guestPhone}</p>
        ${guestEmail ? `<p>📧 Email: ${guestEmail}</p>` : ""}`
      );
    } catch {}

    return NextResponse.json({ success: true, booking: result, table: usedTable });
  } catch (err) {
    console.error("Event booking error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
