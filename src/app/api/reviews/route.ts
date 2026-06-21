import { NextRequest, NextResponse } from "next/server";
import { getReviews, createReview } from "@/lib/data";

export async function GET(req: NextRequest) {
  const hostId = req.nextUrl.searchParams.get("hostId") ?? undefined;
  const reviews = await getReviews(hostId);
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const review = await createReview(body);
  return NextResponse.json(review, { status: 201 });
}
