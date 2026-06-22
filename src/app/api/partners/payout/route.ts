import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rateLimit";

const MIN_PAYOUT = 30;

export async function POST(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { amount, method, details } = await req.json();

  if (!amount || amount < MIN_PAYOUT) {
    return NextResponse.json({ error: `Minimum payout is $${MIN_PAYOUT}` }, { status: 400 });
  }
  if (!["idram", "bank_transfer", "crypto"].includes(method)) {
    return NextResponse.json({ error: "Invalid method" }, { status: 400 });
  }
  if (!details) {
    return NextResponse.json({ error: "Payment details required" }, { status: 400 });
  }

  const { data: partner } = await supabase
    .from("hayhome_partners")
    .select("*")
    .eq("user_id", auth.id)
    .single();

  if (!partner) return NextResponse.json({ error: "Not a partner" }, { status: 403 });
  if (partner.status !== "active") return NextResponse.json({ error: "Account frozen" }, { status: 403 });
  if (partner.balance < amount) return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });

  const payout = {
    id: crypto.randomUUID(),
    partner_id: partner.id,
    amount,
    method,
    details,
    status: "pending",
  };

  // Списываем с баланса сразу
  const { error } = await supabase
    .from("hayhome_partners")
    .update({ balance: partner.balance - amount })
    .eq("id", partner.id);

  if (error) return NextResponse.json({ error: "Failed to process" }, { status: 500 });

  const { error: pErr } = await supabase.from("hayhome_payouts").insert(payout);
  if (pErr) {
    // Откат баланса
    await supabase.from("hayhome_partners").update({ balance: partner.balance }).eq("id", partner.id);
    return NextResponse.json({ error: "Failed to create payout" }, { status: 500 });
  }

  return NextResponse.json({ payout, newBalance: partner.balance - amount });
}
