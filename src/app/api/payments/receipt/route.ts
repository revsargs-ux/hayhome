import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export async function GET(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const paymentId = req.nextUrl.searchParams.get("payment_id");
  if (!paymentId) {
    return NextResponse.json({ error: "payment_id required" }, { status: 400 });
  }

  // Fetch payment
  const { data: payment, error } = await supabase
    .from("hayhome_payments")
    .select("*")
    .eq("id", paymentId)
    .single();

  if (error || !payment) {
    return NextResponse.json({ error: "Payment not found" }, { status: 404 });
  }

  // Ownership check
  if (payment.user_id !== user.id && user.role !== "admin") {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 });
  }

  // Fetch booking if exists
  let booking: { guestName?: string; hostName?: string; checkIn?: string; checkOut?: string } | null = null;
  if (payment.booking_id) {
    const { data: b } = await supabase
      .from("hayhome_bookings")
      .select("guestName, hostName, checkIn, checkOut")
      .eq("id", payment.booking_id)
      .single();
    booking = b;
  }

  // Build PDF
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const page = pdfDoc.addPage([595, 842]); // A4
  const { width, height } = page.getSize();
  const dark = rgb(0.1, 0.1, 0.1);
  const gray = rgb(0.5, 0.5, 0.5);
  const red = rgb(0.83, 0, 0.1);
  const gold = rgb(0.95, 0.66, 0);

  let y = height - 60;

  // Header
  page.drawText("HayHome", { x: 50, y, size: 28, font: fontBold, color: red });
  page.drawText("Armenian Hospitality", { x: 50, y: y - 22, size: 11, font, color: gold });
  page.drawText("Receipt", { x: width - 150, y: y, size: 20, font: fontBold, color: dark });
  y -= 60;

  // Line separator
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 1, color: rgb(0.9, 0.9, 0.9) });
  y -= 30;

  // Company info
  page.drawText("IP Sargsyan (HayHome)", { x: 50, y, size: 10, font: fontBold, color: dark });
  y -= 14;
  page.drawText("hay-home.com | hayhome.arm@gmail.com", { x: 50, y, size: 9, font, color: gray });
  y -= 30;

  // Receipt details
  const rows: [string, string][] = [
    ["Receipt #", payment.id.substring(0, 8).toUpperCase()],
    ["Date", new Date(payment.created_at || Date.now()).toLocaleDateString("en-GB")],
    ["Payment Method", payment.method?.toUpperCase() || "—"],
    ["Status", payment.status?.toUpperCase() || "—"],
  ];

  if (booking) {
    rows.push(["Guest", booking.guestName || "—"]);
    rows.push(["Host Family", booking.hostName || "—"]);
    if (booking.checkIn) rows.push(["Check-in", booking.checkIn]);
    if (booking.checkOut) rows.push(["Check-out", booking.checkOut]);
  }

  for (const [label, value] of rows) {
    page.drawText(label + ":", { x: 50, y, size: 10, font, color: gray });
    page.drawText(value, { x: 200, y, size: 10, font: fontBold, color: dark });
    y -= 18;
  }

  y -= 20;
  page.drawLine({ start: { x: 50, y }, end: { x: width - 50, y }, thickness: 0.5, color: rgb(0.9, 0.9, 0.9) });
  y -= 30;

  // Amount
  page.drawText("TOTAL", { x: 50, y, size: 14, font: fontBold, color: dark });
  const amountStr = `${payment.currency || "USD"} ${Number(payment.amount).toFixed(2)}`;
  page.drawText(amountStr, { x: width - 200, y, size: 18, font: fontBold, color: red });
  y -= 40;

  // Footer
  page.drawText("This document confirms payment for services rendered by HayHome.", { x: 50, y: 80, size: 8, font, color: gray });
  page.drawText("Thank you for choosing Armenian hospitality!", { x: 50, y: 66, size: 8, font, color: gray });
  page.drawText("IP Sargsyan · hay-home.com", { x: 50, y: 52, size: 8, font, color: gray });

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(new Uint8Array(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="receipt-${paymentId.substring(0, 8)}.pdf"`,
    },
  });
}
