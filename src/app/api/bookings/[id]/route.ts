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

    // ── Cancellation policy: block cancellation within 24h of check-in ──
    if (body.status === "cancelled") {
      const { data: bookingData } = await supabase
        .from("hayhome_bookings")
        .select("checkIn, status")
        .eq("id", id)
        .single();
      if (bookingData) {
        const checkInDate = new Date(bookingData.checkIn);
        const hoursUntilCheckIn = (checkInDate.getTime() - Date.now()) / (1000 * 60 * 60);
        if (hoursUntilCheckIn < 24 && hoursUntilCheckIn > 0 && bookingData.status !== "pending") {
          return NextResponse.json(
            { error: "Cannot cancel within 24 hours of check-in. Contact support." },
            { status: 409 }
          );
        }
      }
    }

    updates.status = body.status;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const booking = await updateBooking(id, updates);
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // ── On cancellation: free calendar + refund payments ──
  if (body.status === "cancelled") {
    const { data: fullBooking } = await supabase
      .from("hayhome_bookings")
      .select("host_id, checkIn, checkOut")
      .eq("id", id)
      .single();

    if (fullBooking) {
      // Free calendar dates
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

      // ── Refund logic: mark payments as refunded ──
      const { data: payments } = await supabase
        .from("hayhome_payments")
        .select("id, status, method, provider_payment_id")
        .eq("booking_id", id)
        .eq("status", "completed");

      if (payments && payments.length > 0) {
        for (const payment of payments) {
          // Mark as refund_pending in DB
          await supabase
            .from("hayhome_payments")
            .update({ status: "refund_pending" })
            .eq("id", payment.id);

          // Process actual refund via provider
          try {
            if (payment.method === "stripe" && payment.provider_payment_id && process.env.STRIPE_SECRET_KEY) {
              await fetch(`https://api.stripe.com/v1/payment_links/${payment.provider_payment_id}/line_items`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}` },
              });
              // For Stripe Checkout Sessions, refund via sessions→payment_intent
              const sessionRes = await fetch(`https://api.stripe.com/v1/checkout/sessions/${payment.provider_payment_id}`, {
                headers: { "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}` },
              });
              if (sessionRes.ok) {
                const session = await sessionRes.json();
                if (session.payment_intent) {
                  await fetch(`https://api.stripe.com/v1/refunds`, {
                    method: "POST",
                    headers: {
                      "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `payment_intent=${session.payment_intent}`,
                  });
                }
              }
            } else if (payment.method === "yookassa" && payment.provider_payment_id && process.env.YOOKASSA_CLIENT_ID && process.env.YOOKASSA_SECRET_KEY) {
              await fetch(`https://api.yookassa.ru/v3/payments/${payment.provider_payment_id}/cancel`, {
                method: "POST",
                headers: {
                  "Authorization": "Basic " + Buffer.from(`${process.env.YOOKASSA_CLIENT_ID}:${process.env.YOOKASSA_SECRET_KEY}`).toString("base64"),
                  "Content-Type": "application/json",
                  "Idempotence-Key": `refund-${payment.id}`,
                },
                body: JSON.stringify({}),
              });
            }

            // Mark as refunded
            await supabase
              .from("hayhome_payments")
              .update({ status: "refunded" })
              .eq("id", payment.id);
          } catch (refundErr) {
            console.error(`[refund] Payment ${payment.id} refund failed:`, refundErr);
            // Revert to completed so admin can retry manually
            await supabase
              .from("hayhome_payments")
              .update({ status: "completed" })
              .eq("id", payment.id);
          }
        }
      }
    }
  }

  return NextResponse.json(booking);
}
