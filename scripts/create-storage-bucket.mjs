/**
 * Create Supabase Storage bucket "hayhome-media" for file uploads.
 * Run: node scripts/create-storage-bucket.mjs
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve } from "path";

// Load .env.local manually (no dotenv dependency)
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf-8");
const env = {};
for (const line of envContent.split("\n")) {
  const m = line.match(/^([A-Z_]+)=(.*)$/);
  if (m) env[m[1]] = m[2].trim();
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
});

const BUCKET_ID = "hayhome-media";

async function main() {
  // Check if bucket already exists
  const { data: existing, error: listError } = await supabase.storage.listBuckets();

  if (listError) {
    console.error("❌ Failed to list buckets:", listError.message);
    process.exit(1);
  }

  const found = existing?.find((b) => b.id === BUCKET_ID);

  if (found) {
    console.log(`✅ Bucket "${BUCKET_ID}" already exists — updating settings...`);
    const { error: updateError } = await supabase.storage.updateBucket(BUCKET_ID, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4",
        "audio/mpeg",
        "audio/wav",
      ],
    });

    if (updateError) {
      console.error("❌ Failed to update bucket:", updateError.message);
      process.exit(1);
    }
    console.log(`✅ Bucket "${BUCKET_ID}" updated successfully.`);
  } else {
    console.log(`📦 Creating bucket "${BUCKET_ID}"...`);
    const { data, error } = await supabase.storage.createBucket(BUCKET_ID, {
      public: true,
      fileSizeLimit: 5 * 1024 * 1024, // 5MB
      allowedMimeTypes: [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "video/mp4",
        "audio/mpeg",
        "audio/wav",
      ],
    });

    if (error) {
      console.error("❌ Failed to create bucket:", error.message);
      process.exit(1);
    }
    console.log(`✅ Bucket "${BUCKET_ID}" created successfully!`);
  }

  // Verify
  const { data: buckets } = await supabase.storage.listBuckets();
  const bucket = buckets?.find((b) => b.id === BUCKET_ID);
  if (bucket) {
    console.log(`   Public: ${bucket.public}`);
    console.log(`   Size limit: 5MB`);
    console.log(`   Allowed: images, video/mp4, audio`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
