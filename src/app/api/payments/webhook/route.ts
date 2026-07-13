import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import crypto from "crypto";

// ── Stripe Webhook Signature Verification ──
function verifyStripeSignature(payload: string, signature: string, secret: string): boolean {
  const elements = signature.split(",");
  let timestamp = "";
  const signatures: string[] = [];
  for (const el of elements) {
    const [key, value] = el.split("=");
    if (key === "t") timestamp = value;
    if (key === "v1") signatures.push(value);
  }
  if (!timestamp || signatures.length === 0) return false;

  // Check timestamp freshness (5 min tolerance)
  const age = Math.floor(Date.now() / 1000) - parseInt(timestamp);
  if (age > 300) return false;

  const signedPayload = `${timestamp}.${payload}`;
  const expectedSig = crypto.createHmac("sha256", secret).update(signedPayload).digest("hex");
  return signatures.some((sig) => {
    try {
      const a = Buffer.from(sig, "hex");
      const b = Buffer.from(expectedSig, "hex");
      return a.length === b.length && crypto.timingSafeEqual(a, b);
    } catch {
      return false;
    }
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature") || "";
  const contentType = req.headers.get("content-type") || "";

  // ── Stripe Webhook ──
  if (signature) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    // Verify signature
    if (!verifyStripeSignature(body, signature, webhookSecret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    try {
      const event = JSON.parse(body);

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const paymentId = session.metadata?.payment_id;

        if (paymentId) {
          // Idempotency check — skip if already completed
          const { data: existing } = await supabase
            .from("hayhome_payments")
            .select("status")
            .eq("id", paymentId)
            .single();
          if (existing?.status === "completed") {
            return NextResponse.json({ received: true, duplicate: true });
          }

          await supabase
            .from("hayhome_payments")
            .update({ status: "completed" })
            .eq("id", paymentId);

          const { data: payment } = await supabase
            .from("hayhome_payments")
            .select("booking_id, service_booking_id")
            .eq("id", paymentId)
            .single();

          // Проживание бесплатно — статус уже confirmed при создании бронирования
          // Webhook обновляет только платные услуги (service_bookings)
          if (payment?.service_booking_id) {
            await supabase
              .from("hayhome_service_bookings")
              .update({ status: "confirmed" })
              .eq("id", payment.service_booking_id);
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
    const yookassaSecret = process.env.YOOKASSA_WEBHOOK_SECRET;
    if (!yookassaSecret) {
      return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
    }

    // Verify YooKassa signature (IP whitelist or shared secret header)
    const incomingSecret = req.headers.get("x-yookassa-secret") || "";
    if (incomingSecret !== yookassaSecret) {
      return NextResponse.json({ error: "Invalid webhook secret" }, { status: 401 });
    }

    try {
      const event = JSON.parse(body);

      if (event.event === "payment.succeeded") {
        const payment = event.object;
        const paymentId = payment.metadata?.payment_id;

        if (paymentId) {
          // Idempotency check
          const { data: existing } = await supabase
            .from("hayhome_payments")
            .select("status")
            .eq("id", paymentId)
            .single();
          if (existing?.status === "completed") {
            return NextResponse.json({ received: true, duplicate: true });
          }

          await supabase
            .from("hayhome_payments")
            .update({ status: "completed" })
            .eq("id", paymentId);

          const { data: payRecord } = await supabase
            .from("hayhome_payments")
            .select("booking_id, service_booking_id")
            .eq("id", paymentId)
            .single();

          // Проживание бесплатно — статус уже confirmed при создании
          // Webhook обновляет только платные услуги (service_bookings)
          if (payRecord?.service_booking_id) {
            await supabase
              .from("hayhome_service_bookings")
              .update({ status: "confirmed" })
              .eq("id", payRecord.service_booking_id);
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
