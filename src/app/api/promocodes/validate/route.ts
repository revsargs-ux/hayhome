import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code, amount } = body as { code: string; amount: number };

  if (!code || amount === undefined) {
    return NextResponse.json({ error: "code and amount required" }, { status: 400 });
  }

  const { data: promo, error } = await supabase
    .from("hayhome_promocodes")
    .select("*")
    .eq("code", code.toUpperCase().trim())
    .eq("active", true)
    .single();

  if (error || !promo) {
    return NextResponse.json({ valid: false, error: "Invalid promo code" }, { status: 404 });
  }

  // Check expiry
  if (promo.expires_at && new Date(promo.expires_at) < new Date()) {
    return NextResponse.json({ valid: false, error: "Promo code expired" }, { status: 400 });
  }

  // Check max uses
  if (promo.max_uses !== null && promo.used_count >= promo.max_uses) {
    return NextResponse.json({ valid: false, error: "Promo code usage limit reached" }, { status: 400 });
  }

  // Check min amount
  if (promo.min_amount && amount < Number(promo.min_amount)) {
    return NextResponse.json({
      valid: false,
      error: `Minimum amount is ${promo.min_amount}`,
    }, { status: 400 });
  }

  // Calculate discount
  let discountAmount = 0;
  if (promo.discount_type === "percent") {
    discountAmount = (amount * Number(promo.discount_value)) / 100;
  } else {
    discountAmount = Number(promo.discount_value);
  }

  // Don't allow discount > amount
  discountAmount = Math.min(discountAmount, amount);

  return NextResponse.json({
    valid: true,
    code: promo.code,
    discount_type: promo.discount_type,
    discount_value: Number(promo.discount_value),
    discount_amount: discountAmount,
    final_amount: amount - discountAmount,
  });
}
