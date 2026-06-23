import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("hayhome_promocodes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to fetch promocodes" }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await req.json();
  const { code, discount_type, discount_value, min_amount, max_uses, expires_at } = body;

  if (!code || !discount_type || discount_value === undefined) {
    return NextResponse.json({ error: "code, discount_type, discount_value required" }, { status: 400 });
  }

  if (!["percent", "fixed"].includes(discount_type)) {
    return NextResponse.json({ error: "discount_type must be 'percent' or 'fixed'" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("hayhome_promocodes")
    .insert({
      code: code.toUpperCase().trim(),
      discount_type,
      discount_value: Number(discount_value),
      min_amount: min_amount ? Number(min_amount) : 0,
      max_uses: max_uses ? Number(max_uses) : null,
      expires_at: expires_at || null,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Promocode already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create promocode" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const allowedFields = ["code", "discount_type", "discount_value", "min_amount", "max_uses", "expires_at", "active"];
  const cleanUpdates: Record<string, unknown> = {};
  for (const key of allowedFields) {
    if (key in updates) cleanUpdates[key] = updates[key];
  }

  const { data, error } = await supabase
    .from("hayhome_promocodes")
    .update(cleanUpdates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Failed to update promocode" }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user || user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const { error } = await supabase
    .from("hayhome_promocodes")
    .update({ active: false })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to deactivate promocode" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
