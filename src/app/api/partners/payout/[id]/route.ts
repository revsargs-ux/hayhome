import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { sendPayoutDecisionNotification } from "@/lib/email";

export async function PATCH(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { payoutId, decision, reason } = await req.json();
  if (!payoutId || !["confirmed", "rejected"].includes(decision)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Get payout with partner info
  const { data: payout } = await supabase
    .from("hayhome_payouts")
    .select("*, hayhome_partners(name, email, user_id)")
    .eq("id", payoutId)
    .single();

  if (!payout) return NextResponse.json({ error: "Payout not found" }, { status: 404 });
  if (payout.status !== "pending") return NextResponse.json({ error: "Already processed" }, { status: 400 });

  const newStatus = decision === "confirmed" ? "confirmed" : "rejected";

  await supabase.from("hayhome_payouts").update({ status: newStatus }).eq("id", payoutId);

  // If rejected — return balance to partner
  if (decision === "rejected") {
    await supabase
      .from("hayhome_partners")
      .update({ balance: (payout.partner?.balance || 0) + payout.amount })
      .eq("id", payout.partner_id);
  }

  // Email to partner
  const partner = payout.hayhome_partners;
  if (partner?.email) {
    sendPayoutDecisionNotification({
      partnerEmail: partner.email,
      partnerName: partner.name || "",
      amount: payout.amount,
      decision: decision,
      reason,
    }).catch((err) => console.error("[Email] Payout decision failed:", err));
  }

  return NextResponse.json({ ok: true, newStatus });
}

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth || auth.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: payouts } = await supabase
    .from("hayhome_payouts")
    .select("*, hayhome_partners(name, email, code)")
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json(payouts || []);
}
