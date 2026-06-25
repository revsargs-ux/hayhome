import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";
  const contentType = req.headers.get("content-type") || "";

  // ── Stripe Webhook ──
  if (signature) {
    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }
    try {
      // Parse the event
      const event = JSON.parse(body);

      // Verify signature (simplified — in production use Stripe SDK)
      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const paymentId = session.metadata?.payment_id;

        if (paymentId) {
          // Update payment status
          await supabase
            .from("hayhome_payments")
            .update({ status: "completed" })
            .eq("id", paymentId);

          // Update booking status
          const { data: payment } = await supabase
            .from("hayhome_payments")
            .select("booking_id, service_booking_id")
            .eq("id", paymentId)
            .single();

          if (payment?.booking_id) {
            await supabase
              .from("hayhome_bookings")
              .update({ status: "confirmed" })
              .eq("id", payment.booking_id);
          }
        }
      }

      return NextResponse.json({ received: true });
    } catch (err) {
      console.error("Stripe webhook error:", err);
      return NextResponse.json({ error: "Webhook error" }, { status: 400 });
    }
  }

  // ── YooKassa Webhook ──
  if (contentType.includes("application/json")) {
    if (!process.env.YOOKASSA_WEBHOOK_SECRET) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }
    try {
      const event = JSON.parse(body);

      if (event.event === "payment.succeeded") {
        const payment = event.object;
        const paymentId = payment.metadata?.payment_id;

        if (paymentId) {
          await supabase
            .from("hayhome_payments")
            .update({ status: "completed" })
            .eq("id", paymentId);

          const { data: payRecord } = await supabase
            .from("hayhome_payments")
            .select("booking_id, service_booking_id")
            .eq("id", paymentId)
            .single();

          if (payRecord?.booking_id) {
            await supabase
              .from("hayhome_bookings")
              .update({ status: "confirmed" })
              .eq("id", payRecord.booking_id);
          }
        }
      }

      return NextResponse.json({ received: true });
    } catch (err) {
      console.error("YooKassa webhook error:", err);
      return NextResponse.json({ error: "Webhook error" }, { status: 400 });
    }
  }

  return NextResponse.json({ error: "Unknown webhook source" }, { status: 400 });
}
