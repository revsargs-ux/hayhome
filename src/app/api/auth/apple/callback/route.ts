import { NextRequest } from "next/server";
import { oauthCallback, oauthCallbackPost } from "@/lib/oauth-handler";

// Apple uses form_post response mode
export async function GET(req: NextRequest) {
  return oauthCallback(req, "apple");
}

export async function POST(req: NextRequest) {
  return oauthCallbackPost(req, "apple");
}
