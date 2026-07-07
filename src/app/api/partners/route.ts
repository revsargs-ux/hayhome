import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { rateLimit } from "@/lib/rateLimit";

const COMMISSION_RATE = 0.05; // 5%
const MIN_PAYOUT = 30;

function generateCode(name: string): string {
  const base = (name || "PARTNER").toUpperCase().replace(/[^A-ZА-ЯЄ]/g, "").slice(0, 6);
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `HAY-${base}-${rand}`;
}

export async function POST(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role, region } = await req.json();
  if (!["ambassador", "hunter", "regional"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (role === "regional" && !region) {
    return NextResponse.json({ error: "Region required for regional partner" }, { status: 400 });
  }

  // Проверяем нет ли уже партнёрства
  const { data: existing } = await supabase
    .from("hayhome_partners")
    .select("id, status")
    .eq("user_id", auth.id)
    .single();

  if (existing) {
    if (existing.status === "suspended") {
      return NextResponse.json({ error: "Your account is suspended" }, { status: 403 });
    }
    return NextResponse.json({ partner: existing, message: "Already a partner" });
  }

  const code = generateCode(auth.name);
  const partner = {
    id: crypto.randomUUID(),
    user_id: auth.id,
    role,
    region: region || null,
    code,
    status: "pending",
    balance: 0,
    total_earned: 0,
    total_withdrawn: 0,
  };

  const { error } = await supabase.from("hayhome_partners").insert(partner);
  if (error) {
    // Если код не уникален — попробуем ещё раз
    if (error.message?.includes("unique")) {
      partner.code = generateCode(auth.name + Date.now());
      const { error: e2 } = await supabase.from("hayhome_partners").insert(partner);
      if (e2) return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
    } else {
      return NextResponse.json({ error: "Failed to create partner" }, { status: 500 });
    }
  }

  return NextResponse.json({ partner });
}

export async function GET(req: NextRequest) {
  const auth = await getAuthUser(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: partner } = await supabase
    .from("hayhome_partners")
    .select("*")
    .eq("user_id", auth.id)
    .single();

  if (!partner) {
    return NextResponse.json({ partner: null });
  }

  // Статистика
  const { count: referrals } = await supabase
    .from("hayhome_referrals")
    .select("id", { count: "exact", head: true })
    .eq("partner_id", partner.id);

  const { data: recentPayouts } = await supabase
    .from("hayhome_payouts")
    .select("*")
    .eq("partner_id", partner.id)
    .order("created_at", { ascending: false })
    .limit(10);

  return NextResponse.json({
    partner,
    stats: { totalReferrals: referrals || 0 },
    recentPayouts: recentPayouts || [],
  });
}
