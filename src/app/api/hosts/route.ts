import { NextRequest, NextResponse } from "next/server";
import { getHosts, createHost } from "@/lib/data";
import { sendHostApplicationNotification } from "@/lib/email";

export async function GET(req: NextRequest) {
  const all = req.nextUrl.searchParams.get("all");
  const hosts = await getHosts();
  if (all) return NextResponse.json(hosts);
  return NextResponse.json(hosts.filter((h) => h.status === "active"));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const host = await createHost(body);

  // Отправляем email уведомление (асинхронно)
  sendHostApplicationNotification({
    familyName: body.familyName,
    name: body.name,
    email: body.email,
    phone: body.phone,
    city: body.city,
    region: body.region,
    pricePerNight: body.pricePerNight,
    description: body.description,
  }).catch((err) => console.error("[Email] Host application notification failed:", err));

  return NextResponse.json(host, { status: 201 });
}
