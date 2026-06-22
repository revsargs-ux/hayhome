import { NextRequest, NextResponse } from "next/server";
import { updateBooking } from "@/lib/data";
import { getAuthUser } from "@/lib/auth";

const ALLOWED_STATUSES = ["pending", "confirmed", "cancelled", "completed"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Auth required — only admin can change booking status
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (user.role !== "admin" && user.role !== "host") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

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
  return NextResponse.json(booking);
}
