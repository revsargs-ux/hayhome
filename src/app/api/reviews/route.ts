import { NextRequest, NextResponse } from "next/server";
import { getReviews, createReview } from "@/lib/data";
import { getAuthUser } from "@/lib/auth";
import { rateLimit } from "@/lib/rateLimit";
import { supabase } from "@/lib/supabase";

const MAX_COMMENT = 2000;
const MAX_NAME = 100;

export async function GET(req: NextRequest) {
  const hostId = req.nextUrl.searchParams.get("hostId") ?? undefined;
  const reviews = await getReviews(hostId);
  return NextResponse.json(reviews);
}

export async function POST(req: NextRequest) {
  // Rate limit
  const blocked = rateLimit(req);
  if (blocked) return blocked;

  // Auth required to leave a review
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const body = await req.json();
  const { hostId, rating, comment, media, media_type } = body;

  // Validation
  if (!hostId || typeof hostId !== "string") {
    return NextResponse.json({ error: "hostId required" }, { status: 400 });
  }
  if (!rating || typeof rating !== "number" || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }
  if (!comment || typeof comment !== "string" || comment.trim().length < 10) {
    return NextResponse.json({ error: "Comment too short (min 10 chars)" }, { status: 400 });
  }
  if (comment.length > MAX_COMMENT) {
    return NextResponse.json({ error: `Comment too long (max ${MAX_COMMENT})` }, { status: 400 });
  }

  // Media validation
  const mediaUrls: string[] = Array.isArray(media) ? media.filter((m: unknown) => typeof m === "string") : [];
  let mediaType: "image" | "audio" | "video" | "mixed" | undefined;
  if (typeof media_type === "string" && ["image", "audio", "video", "mixed"].includes(media_type)) {
    mediaType = media_type as "image" | "audio" | "video" | "mixed";
  } else if (mediaUrls.length > 0) {
    mediaType = "mixed";
  }

  // Use authenticated user's name, not client-provided
  // ── Verify user had a completed booking with this host ──
  const { data: userBooking } = await supabase
    .from("hayhome_bookings")
    .select("id, status")
    .eq("hostId", hostId)
    .eq("guestEmail", user.email)
    .limit(1);

  if (!userBooking || userBooking.length === 0) {
    return NextResponse.json({ error: "You can only review hosts you have booked with" }, { status: 403 });
  }

  // ── Check for duplicate review (1 user = 1 review per host) ──
  const { data: existingReview } = await supabase
    .from("hayhome_reviews")
    .select("id")
    .eq("hostId", hostId)
    .eq("guestEmail", user.email)
    .limit(1);

  if (existingReview && existingReview.length > 0) {
    return NextResponse.json({ error: "You have already reviewed this host" }, { status: 409 });
  }

  const review = await createReview({
    hostId,
    guestName: user.name.slice(0, MAX_NAME),
    guestCountry: body.guestCountry?.slice(0, 100) || "Unknown",
    rating: Math.round(rating),
    comment: comment.trim(),
    date: new Date().toISOString().split("T")[0],
    ...(mediaUrls.length > 0 ? { media: mediaUrls, media_type: mediaType } : {}),
  });

  return NextResponse.json(review, { status: 201 });
}
