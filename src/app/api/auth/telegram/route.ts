import { NextRequest, NextResponse } from "next/server";
import { getProviderConfig, getBaseUrl } from "@/lib/oauth";

/**
 * Telegram OAuth redirect.
 * Telegram uses a different OAuth flow via oauth.telegram.org
 */
export async function GET(_req: NextRequest) {
  const config = getProviderConfig("telegram");
  if (!config) return NextResponse.json({ error: "Telegram login not configured" }, { status: 503 });

  const botId = config.clientId;
  const origin = encodeURIComponent(getBaseUrl());
  const redirectUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${origin}&embed=0&request_access=write`;

  return NextResponse.redirect(redirectUrl);
}
