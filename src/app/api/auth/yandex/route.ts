import { NextRequest } from "next/server";
import { oauthRedirect } from "@/lib/oauth-handler";

export async function GET(_req: NextRequest) {
  return oauthRedirect(_req, "yandex");
}
