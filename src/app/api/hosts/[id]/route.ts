import { NextRequest, NextResponse } from "next/server";
import { getHost, updateHost } from "@/lib/data";
import { getAuthUser } from "@/lib/auth";

const ALLOWED_FIELDS = [
  "familyName", "name", "description", "longDescription",
  "coverPhoto", "photos", "amenities", "experiences", "languages",
  "maxGuests", "availableRooms", "i18n", "location", "city", "region",
  "phone", "email",
];
const ADMIN_ONLY_FIELDS = ["status", "verified"];

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const host = await getHost(id);
  if (!host) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(host);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const { id } = await params;
  const host = await getHost(id);
  if (!host) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Ownership check: only admin or host owner can PATCH
  const isAdmin = user.role === "admin";
  const hostUserId = (host as any).user_id || (host as any).userId;
  if (!isAdmin && hostUserId !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  const updates = await req.json();

  // Field whitelist validation
  const filtered: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(updates)) {
    if (ALLOWED_FIELDS.includes(key)) {
      filtered[key] = value;
    } else if (ADMIN_ONLY_FIELDS.includes(key)) {
      if (isAdmin) {
        filtered[key] = value;
      }
    } else {
      return NextResponse.json({ error: `Field "${key}" is not allowed` }, { status: 400 });
    }
  }

  if (Object.keys(filtered).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const updated = await updateHost(id, filtered);
  if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(updated);
}
