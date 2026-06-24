import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

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

export async function POST(req: NextRequest) {
  // Auth check
  const user = await getAuthUser(req);
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  // Rate limit
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || req.headers.get("x-real-ip")
    || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many uploads. Try again later." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  // Ensure upload directory exists
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
  } catch {
    // Directory might already exist
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
    return NextResponse.json({ error: "Max 10 files per upload" }, { status: 400 });
  }

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

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`${file.name}: exceeds 5MB`);
      continue;
    }

    // Generate safe filename
    const ext = path.extname(file.name).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      errors.push(`${file.name}: invalid extension`);
      continue;
    }

    const hash = crypto.randomBytes(12).toString("hex");
    const timestamp = Date.now();
    const safeName = `${timestamp}-${hash}${ext}`;
    const filePath = path.join(UPLOAD_DIR, safeName);

    // Write file
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(filePath, buffer);
      uploadedUrls.push(`/uploads/${safeName}`);
    } catch {
      errors.push(`${file.name}: failed to save`);
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
