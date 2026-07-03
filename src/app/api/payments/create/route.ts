import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await req.json();
  const { booking_id, service_booking_id, method, currency } = body as {
    booking_id?: string;
    service_booking_id?: string;
    method: "stripe" | "yookassa";
    currency?: "USD" | "RUB" | "AMD";
  };

  if (!method || !["stripe", "yookassa"].includes(method)) {
    return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
  }

  // ── Server-side amount calculation ──
  let amount = 0;

  if (booking_id) {
    // Verify booking belongs to user
    const { data: booking } = await supabase
      .from("hayhome_bookings")
      .select("totalPrice, guestEmail, status")
      .eq("id", booking_id)
      .single();
    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    if (booking.guestEmail !== user.email && user.role !== "admin") {
      return NextResponse.json({ error: "Not your booking" }, { status: 403 });
    }
    amount = Math.round(Number(booking.totalPrice) * 0.15 * 100) / 100; // 15% commission
  } else if (service_booking_id) {
    // Verify service booking
    const { data: svcBooking } = await supabase
      .from("hayhome_service_bookings")
      .select("total_price, status")
      .eq("id", service_booking_id)
      .single();
    if (!svcBooking) {
      return NextResponse.json({ error: "Service booking not found" }, { status: 404 });
    }
    amount = Number(svcBooking.total_price);
  } else {
    return NextResponse.json({ error: "booking_id or service_booking_id required" }, { status: 400 });
  }

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const finalCurrency = currency || "USD";

  // Check if payment provider is configured
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const yookassaId = process.env.YOOKASSA_CLIENT_ID;
  const yookassaSecret = process.env.YOOKASSA_SECRET_KEY;

  if (method === "stripe" && !stripeKey) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
  }

  if (method === "yookassa" && (!yookassaId || !yookassaSecret)) {
    return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
  }

  // Create payment record
  const { data: payment, error: dbError } = await supabase
    .from("hayhome_payments")
    .insert({
      booking_id: booking_id || null,
      service_booking_id: service_booking_id || null,
      user_id: user.id,
      amount,
      currency: finalCurrency,
      method,
      status: "pending",
    })
    .select()
    .single();

  if (dbError) {
    return NextResponse.json({ error: "Failed to create payment record" }, { status: 500 });
  }

  try {
    if (method === "stripe" && stripeKey) {
      // Create Stripe Checkout Session via direct API call
      const origin = req.nextUrl.origin;
      const stripeRes = await fetch("https://api.stripe.com/v1/checkout/sessions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${stripeKey}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          "mode": "payment",
          "amount": Math.round(amount * 100).toString(),
          "currency": finalCurrency.toLowerCase(),
          "success_url": `${origin}/payment/success?payment_id=${payment.id}`,
          "cancel_url": `${origin}/payment/cancel?payment_id=${payment.id}`,
          "metadata[payment_id]": payment.id,
          "metadata[user_id]": user.id,
          ...(booking_id ? { "metadata[booking_id]": booking_id } : {}),
        }).toString(),
      });

      if (!stripeRes.ok) {
        const errBody = await stripeRes.text();
        console.error("Stripe error:", errBody);
        return NextResponse.json({ error: "Failed to create Stripe session" }, { status: 502 });
      }

      const session = await stripeRes.json();

      // Update payment record with provider ID
      await supabase
        .from("hayhome_payments")
        .update({ provider_payment_id: session.id })
        .eq("id", payment.id);

      return NextResponse.json({
        url: session.url,
        payment_id: payment.id,
        provider_payment_id: session.id,
      });
    }

    if (method === "yookassa" && yookassaId && yookassaSecret) {
      // Create YooKassa payment
      const origin = req.nextUrl.origin;
      const idempotenceKey = payment.id;

      const ykRes = await fetch("https://api.yookassa.ru/v3/payments", {
        method: "POST",
        headers: {
          "Authorization": "Basic " + Buffer.from(`${yookassaId}:${yookassaSecret}`).toString("base64"),
          "Content-Type": "application/json",
          "Idempotence-Key": idempotenceKey,
        },
        body: JSON.stringify({
          amount: {
            value: amount.toFixed(2),
            currency: finalCurrency === "USD" ? "USD" : finalCurrency === "RUB" ? "RUB" : "RUB",
          },
          capture: true,
          confirmation: {
            type: "redirect",
            return_url: `${origin}/payment/success?payment_id=${payment.id}`,
          },
          description: `HayHome booking ${booking_id || payment.id}`,
          metadata: {
            payment_id: payment.id,
            user_id: user.id,
            ...(booking_id ? { booking_id } : {}),
          },
        }),
      });

      if (!ykRes.ok) {
        const errBody = await ykRes.text();
        console.error("YooKassa error:", errBody);
        return NextResponse.json({ error: "Failed to create YooKassa payment" }, { status: 502 });
      }

      const ykPayment = await ykRes.json();

      // Update payment record
      await supabase
        .from("hayhome_payments")
        .update({ provider_payment_id: ykPayment.id })
        .eq("id", payment.id);

      const confirmUrl = ykPayment.confirmation?.confirmation_url;

      return NextResponse.json({
        url: confirmUrl || "",
        payment_id: payment.id,
        provider_payment_id: ykPayment.id,
      });
    }

    return NextResponse.json({ error: "Payment not configured" }, { status: 503 });
  } catch (err) {
    console.error("Payment creation error:", err);
    return NextResponse.json({ error: "Payment processing error" }, { status: 500 });
  }
}
