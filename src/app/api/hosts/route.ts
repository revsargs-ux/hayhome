import { NextRequest, NextResponse } from "next/server";
import { getHosts, createHost } from "@/lib/data";
import { rateLimit } from "@/lib/rateLimit";
import { getAuthUser } from "@/lib/auth";
import { sendHostApplicationNotification } from "@/lib/email";
import { createClient } from "@supabase/supabase-js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_TEXT = 2000;
const stripHtml = (s: string) => s.replace(/<[^>]*>/g, "").trim();

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all");
  if (all) {
    const user = await getAuthUser(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }
    const hosts = await getHosts(true); // includeAll = true — all statuses
    return NextResponse.json(hosts);
  }
  const hosts = await getHosts();
  return NextResponse.json(hosts);
}

export async function POST(req: NextRequest) {
  // Rate limit
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  // Optional auth — link host to user account if logged in
  const user = await getAuthUser(req).catch(() => null);

  const body = await req.json();

  // Validate required fields
  const required = ["name", "familyName", "city", "region", "phone", "email"];
  for (const field of required) {
    if (!body[field] || typeof body[field] !== "string" || body[field].trim().length === 0) {
      return NextResponse.json({ error: `${field} is required` }, { status: 400 });
    }
  }
  if (!EMAIL_RE.test(body.email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  // pricePerNight опционально — проживание бесплатно
  if (body.pricePerNight !== undefined && (typeof body.pricePerNight !== "number" || body.pricePerNight < 0 || body.pricePerNight > 10000)) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }
  if (typeof body.stars !== "number" || body.stars < 1 || body.stars > 5) {
    return NextResponse.json({ error: "Invalid stars" }, { status: 400 });
  }

  // Sanitize text fields — strip HTML tags to prevent stored XSS
  const sanitize = (v: unknown, max: number = MAX_TEXT) =>
    typeof v === "string" ? stripHtml(v).slice(0, max) : "";

  const hostData = {
    name: stripHtml(String(body.name)).slice(0, 100),
    familyName: stripHtml(String(body.familyName)).slice(0, 200),
    patronymic: sanitize(body.patronymic, 100),
    location: sanitize(body.location, 300),
    city: String(body.city).slice(0, 100),
    region: String(body.region).slice(0, 100),
    stars: body.stars,
    pricePerNight: body.pricePerNight ?? 0,
    stayFree: body.stayFree === true,
    allowsDayVisit: body.allowsDayVisit === true,
    serviceCategories: Array.isArray(body.serviceCategories) ? body.serviceCategories.slice(0, 10) : [],
    description: sanitize(body.description),
    longDescription: sanitize(body.longDescription),
    i18n: body.i18n || {},
    coverPhoto: sanitize(body.coverPhoto, 1000),
    photos: Array.isArray(body.photos) ? body.photos.slice(0, 20) : [],
    badges: Array.isArray(body.badges) ? body.badges.slice(0, 10) : [],
    languages: Array.isArray(body.languages) ? body.languages.slice(0, 20) : [],
    amenities: Array.isArray(body.amenities) ? body.amenities.slice(0, 30) : [],
    experiences: Array.isArray(body.experiences) ? body.experiences.slice(0, 30) : [],
    maxGuests: typeof body.maxGuests === "number" ? Math.min(body.maxGuests, 50) : 1,
    availableRooms: typeof body.availableRooms === "number" ? Math.min(body.availableRooms, 20) : 1,
    passportSeries: sanitize(body.passportSeries, 20),
    passportNumber: sanitize(body.passportNumber, 30),
    passportDate: sanitize(body.passportDate, 20),
    passportIssued: sanitize(body.passportIssued, 200),
    inn: sanitize(body.inn, 20),
    bankAccount: sanitize(body.bankAccount, 50),
    bankName: sanitize(body.bankName, 100),
    lang: String(body.lang || "en").slice(0, 5),
    phone: String(body.phone).slice(0, 50),
    email: String(body.email).slice(0, 255),
  };

  const host = await createHost(hostData);

  // Email notification (async, non-blocking)
  sendHostApplicationNotification({
    familyName: hostData.familyName,
    name: hostData.name,
    email: hostData.email,
    phone: hostData.phone,
    city: hostData.city,
    region: hostData.region,
    pricePerNight: hostData.pricePerNight,
    description: hostData.description,
  }).catch((err) => console.error("[Email] Host application notification failed:", err));

  // Send contract email (async, non-blocking)
  import("@/lib/notify").then(({ sendContractEmail }) => {
    sendContractEmail({
      hostId: host.id,
      familyName: hostData.familyName,
      name: hostData.name,
      email: hostData.email,
      lang: String(body.lang || "en").slice(0, 5),
    }).catch((err) => console.error("[Email] Contract email failed:", err));
  });

  // Log to application history
  try {
    const sb = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    await sb.from("hayhome_host_history").insert({
      host_id: host.id,
      action: "submitted",
      note: `Заявка: ${hostData.familyName} — ${hostData.city}, ${hostData.region}`,
    });
  } catch (e) {
    console.error("[History] Failed to log submission:", e);
  }

  return NextResponse.json(host, { status: 201 });
}
