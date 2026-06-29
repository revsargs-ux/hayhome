import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const checks: Record<string, string> = {};

  // Check Supabase
  try {
    const { error } = await supabase.from("hayhome_hosts").select("id").limit(1);
    checks.supabase = error ? "degraded" : "ok";
  } catch {
    checks.supabase = "down";
  }

  // Check env
  checks.env = process.env.JWT_SECRET ? "ok" : "missing";

  const allOk = Object.values(checks).every((v) => v === "ok");

  return NextResponse.json(
    { status: allOk ? "healthy" : "degraded", checks, timestamp: new Date().toISOString() },
    { status: allOk ? 200 : 503 }
  );
}
