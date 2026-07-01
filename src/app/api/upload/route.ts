import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB (photos/videos)
const MAX_PHOTO_SIZE = 10 * 1024 * 1024; // 10MB for photos
const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "audio/mpeg",
  "audio/wav",
];
const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".mp4",
  ".mp3",
  ".wav",
];

const BUCKET = "hayhome-media";
const VALID_FOLDERS = ["hosts", "providers", "reviews", "avatars", "general"];

// Server-side Supabase client with service_role for storage writes (lazy init)
function getSupabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not configured");
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn("[upload] WARNING: Using publishable key — uploads may fail due to RLS");
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

// Simple in-memory rate limiter for uploads
const uploadRequests = new Map<string, { count: number; resetAt: number }>();
const UPLOAD_LIMIT = { max: 30, windowMs: 60_000 }; // 30 per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = uploadRequests.get(ip);
  if (!entry || now > entry.resetAt) {
    uploadRequests.set(ip, { count: 1, resetAt: now + UPLOAD_LIMIT.windowMs });
    return true;
  }
  entry.count++;
  return entry.count <= UPLOAD_LIMIT.max;
}

function extractStoragePath(publicUrl: string): string | null {
  // Supabase public URL format:
  // https://<project>.supabase.co/storage/v1/object/public/<bucket>/<path>
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

// ── POST: Upload files ──
export async function POST(req: NextRequest) {
  // Auth check
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  // Rate limit
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many uploads. Try again later." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // Parse multipart form
  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const files = formData.getAll("files");
  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  if (files.length > 10) {
    return NextResponse.json(
      { error: "Max 10 files per upload" },
      { status: 400 }
    );
  }

  // Get folder (default: general)
  const folder = (formData.get("folder") as string) || "general";
  const safeFolder = VALID_FOLDERS.includes(folder) ? folder : "general";

  const uploadedUrls: string[] = [];
  const errors: string[] = [];

  for (const file of files) {
    if (!(file instanceof File)) {
      errors.push("Invalid file entry");
      continue;
    }

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`${file.name}: invalid type (${file.type})`);
      continue;
    }

    // Validate size — photos 10MB, videos 50MB
    const isVideo = file.type.startsWith("video/");
    const sizeLimit = isVideo ? MAX_FILE_SIZE : MAX_PHOTO_SIZE;
    if (file.size > sizeLimit) {
      errors.push(`${file.name}: exceeds ${isVideo ? "50" : "10"}MB`);
      continue;
    }

    // Generate safe filename
    const ext = extFromType(file.type) || extFromName(file.name);
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      errors.push(`${file.name}: invalid extension`);
      continue;
    }

    const hash = crypto.randomBytes(12).toString("hex");
    const timestamp = Date.now();
    const storagePath = `${safeFolder}/${timestamp}-${hash}${ext}`;

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const { data, error: uploadError } = await getSupabaseServer().storage
        .from(BUCKET)
        .upload(storagePath, buffer, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) {
        errors.push(`${file.name}: ${uploadError.message}`);
        continue;
      }

      // Get public URL
      const { data: urlData } = getSupabaseServer().storage
        .from(BUCKET)
        .getPublicUrl(data.path);

      uploadedUrls.push(urlData.publicUrl);
    } catch {
      errors.push(`${file.name}: failed to upload`);
    }
  }

  if (uploadedUrls.length === 0) {
    return NextResponse.json(
      { error: "No files uploaded", details: errors },
      { status: 400 }
    );
  }

  return NextResponse.json({
    urls: uploadedUrls,
    errors: errors.length > 0 ? errors : undefined,
  });
}

// ── DELETE: Remove file from Supabase Storage ──
export async function DELETE(req: NextRequest) {
  // Auth check
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  let body: { url?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { url } = body;
  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  // Only admin can delete files
  if (user.role !== "admin") {
    return NextResponse.json(
      { error: "Only administrators can delete files. Contact support." },
      { status: 403 }
    );
  }

  const storagePath = extractStoragePath(url);
  if (!storagePath) {
    return NextResponse.json(
      { error: "Not a Supabase Storage URL" },
      { status: 400 }
    );
  }

  const { error: deleteError } = await getSupabaseServer().storage
    .from(BUCKET)
    .remove([storagePath]);

  if (deleteError) {
    return NextResponse.json(
      { error: deleteError.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

// ── Helpers ──
function extFromType(type: string): string | null {
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
    "video/mp4": ".mp4",
    "audio/mpeg": ".mp3",
    "audio/wav": ".wav",
  };
  return map[type] || null;
}

function extFromName(name: string): string {
  const idx = name.lastIndexOf(".");
  if (idx === -1) return "";
  return name.slice(idx).toLowerCase();
}
