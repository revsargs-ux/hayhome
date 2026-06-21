import { NextRequest, NextResponse } from "next/server";
import { getBookings, createBooking } from "@/lib/data";

export async function GET() {
  const bookings = await getBookings();
  return NextResponse.json(bookings);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const booking = await createBooking(body);
  return NextResponse.json(booking, { status: 201 });
}
