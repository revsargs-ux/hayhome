import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getAuthUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";

// Calendar table name
const CALENDAR_TABLE = "hayhome_calendar";

// ============================================
// GET /api/calendar?hostId=X&month=2026-07
// Returns array of calendar entries for that host+month
// ============================================
export async function GET(req: NextRequest) {
  const hostId = req.nextUrl.searchParams.get("hostId");
  if (!hostId) {
    return NextResponse.json({ error: "hostId required" }, { status: 400 });
  }

  const monthParam = req.nextUrl.searchParams.get("month"); // format: YYYY-MM

  let startDate: string;
  let endDate: string;

  if (monthParam) {
    const [year, month] = monthParam.split("-").map(Number);
    if (!year || !month || month < 1 || month > 12) {
      return NextResponse.json({ error: "Invalid month format. Use YYYY-MM" }, { status: 400 });
    }
    startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    // End of month
    const lastDay = new Date(year, month, 0).getDate();
    endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  } else {
    // Default: current month
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    endDate = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  }

  const { data, error } = await supabase
    .from(CALENDAR_TABLE)
    .select("*")
    .eq("host_id", hostId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });

  if (error) {
    console.error("[Calendar] GET error:", error.message);
    return NextResponse.json({ error: "Failed to fetch calendar data" }, { status: 500 });
  }

  return NextResponse.json(data || []);
}

// ============================================
// POST /api/calendar
// Single: { hostId, date, status, note? }
// Batch:  { hostId, dates: [...], status, note? }
// Auth required: admin or host themselves
// ============================================
export async function POST(req: NextRequest) {
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await req.json();

  // Validate
  if (!body.hostId || typeof body.hostId !== "string") {
    return NextResponse.json({ error: "hostId required" }, { status: 400 });
  }

  const validStatuses = ["available", "blocked"];
  if (!body.status || !validStatuses.includes(body.status)) {
    return NextResponse.json({ error: "status must be 'available' or 'blocked'" }, { status: 400 });
  }

  // Authorization: admin or the host themselves
  if (user.role !== "admin") {
    // Check if user email matches this host
    const { data: host } = await supabase
      .from("hayhome_hosts")
      .select("email")
      .eq("id", body.hostId)
      .single();

    if (!host || host.email !== user.email) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
  }

  const note = typeof body.note === "string" ? body.note.slice(0, 500) : null;

  // Batch mode: multiple dates
  if (Array.isArray(body.dates) && body.dates.length > 0) {
    const dates: string[] = body.dates.filter(
      (d: unknown) => typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d as string)
    );

    if (dates.length === 0) {
      return NextResponse.json({ error: "No valid dates provided" }, { status: 400 });
    }

    if (dates.length > 90) {
      return NextResponse.json({ error: "Cannot update more than 90 dates at once" }, { status: 400 });
    }

    // Build upsert rows — only for dates not currently 'booked'
    const { data: existing } = await supabase
      .from(CALENDAR_TABLE)
      .select("date, status")
      .eq("host_id", body.hostId)
      .in("date", dates);

    const bookedDates = new Set(
      (existing || []).filter((e: any) => e.status === "booked").map((e: any) => e.date)
    );

    const upsertRows = dates.map((d) => ({
      host_id: body.hostId,
      date: d,
      status: bookedDates.has(d) ? "booked" : body.status,
      note,
    }));

    const { error } = await supabase
      .from(CALENDAR_TABLE)
      .upsert(upsertRows, { onConflict: "host_id,date" });

    if (error) {
      console.error("[Calendar] POST batch error:", error.message);
      return NextResponse.json({ error: "Failed to update calendar" }, { status: 500 });
    }

    return NextResponse.json({ updated: dates.length });
  }

  // Single date mode
  if (!body.date || typeof body.date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    return NextResponse.json({ error: "Valid date (YYYY-MM-DD) required" }, { status: 400 });
  }

  // Don't overwrite 'booked' dates
  const { data: existing } = await supabase
    .from(CALENDAR_TABLE)
    .select("status")
    .eq("host_id", body.hostId)
    .eq("date", body.date)
    .single();

  if (existing?.status === "booked") {
    return NextResponse.json({ error: "Cannot modify a booked date" }, { status: 409 });
  }

  const { error } = await supabase
    .from(CALENDAR_TABLE)
    .upsert(
      {
        host_id: body.hostId,
        date: body.date,
        status: body.status,
        note,
      },
      { onConflict: "host_id,date" }
    );

  if (error) {
    console.error("[Calendar] POST single error:", error.message);
    return NextResponse.json({ error: "Failed to update calendar" }, { status: 500 });
  }

  return NextResponse.json({ updated: 1 });
}
