import { NextRequest, NextResponse } from "next/server";
import { getBookings, createBooking } from "@/lib/data";
import { sendBookingNotification } from "@/lib/email";

export async function GET() {
  const bookings = await getBookings();
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const booking = await createBooking(body);

  // Отправляем email уведомление (асинхронно, не блокируем ответ)
  sendBookingNotification({
    guestName: body.guestName,
    guestEmail: body.guestEmail,
    guestPhone: body.guestPhone || "",
    guestCountry: body.guestCountry,
    hostName: body.hostName,
    checkIn: body.checkIn,
    checkOut: body.checkOut,
    guests: body.guests,
    totalPrice: body.totalPrice,
    message: body.message,
  }).catch((err) => console.error("[Email] Booking notification failed:", err));

  return NextResponse.json(booking, { status: 201 });
}
