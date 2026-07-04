import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * GET /api/payments/verify?payment_id=xxx
 *
 * Fallback confirmation: if the webhook hasn't fired yet (or was delayed),
 * this endpoint checks the payment record and — if the provider already
 * marked it as completed — confirms the associated booking.
 *
 * It also queries the provider (Stripe/YooKassa) when the payment is still
 * pending but a provider_payment_id exists, covering the edge case where
 * the user returns from checkout before the webhook arrives.
 */
export async function GET(req: NextRequest) {
  const paymentId = req.nextUrl.searchParams.get("payment_id");
  if (!paymentId) {
    return NextResponse.json({ error: "payment_id required" }, { status: 400 });
  }

  const { data: payment, error } = await supabase
    .from("hayhome_payments")
    .select("id, status, method, provider_payment_id, booking_id, service_booking_id")
    .eq("id", paymentId)
    .single();

  if (error || !payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  // ── Already completed — ensure booking is confirmed (idempotent) ──
  if (payment.status === "completed") {
    await confirmBookings(payment);
    return NextResponse.json({ confirmed: true, source: "already_completed" });
  }

  // ── Still pending — check provider ──
  if (payment.status === "pending" && payment.provider_payment_id) {
    let providerConfirmed = false;

    if (payment.method === "stripe") {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (stripeKey) {
        try {
          const res = await fetch(
            `https://api.stripe.com/v1/checkout/sessions/${payment.provider_payment_id}`,
            { headers: { Authorization: `Bearer ${stripeKey}` } },
          );
          if (res.ok) {
            const session = await res.json();
            providerConfirmed = session.payment_status === "paid";
          }
        } catch {
          /* network error — leave providerConfirmed = false */
        }
      }
    }

    if (payment.method === "yookassa") {
      const yookassaId = process.env.YOOKASSA_CLIENT_ID;
      const yookassaSecret = process.env.YOOKASSA_SECRET_KEY;
      if (yookassaId && yookassaSecret) {
        try {
          const res = await fetch(
            `https://api.yookassa.ru/v3/payments/${payment.provider_payment_id}`,
            {
              headers: {
                Authorization:
                  "Basic " +
                  Buffer.from(`${yookassaId}:${yookassaSecret}`).toString("base64"),
              },
            },
          );
          if (res.ok) {
            const ykPayment = await res.json();
            providerConfirmed = ykPayment.status === "succeeded";
          }
        } catch {
          /* network error */
        }
      }
    }

    if (providerConfirmed) {
      // Mark payment completed
      await supabase
        .from("hayhome_payments")
        .update({ status: "completed" })
        .eq("id", payment.id);

      await confirmBookings(payment);
      return NextResponse.json({ confirmed: true, source: "provider_verified" });
    }
  }

  return NextResponse.json({ confirmed: false, status: payment.status });
}

// ── Helpers ──

async function confirmBookings(payment: {
  booking_id: string | null;
  service_booking_id: string | null;
}) {
  if (payment.booking_id) {
    await supabase
      .from("hayhome_bookings")
      .update({ status: "confirmed" })
      .eq("id", payment.booking_id);
  }
  if (payment.service_booking_id) {
    await supabase
      .from("hayhome_service_bookings")
      .update({ status: "confirmed" })
      .eq("id", payment.service_booking_id);
  }
}
