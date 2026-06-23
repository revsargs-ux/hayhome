import { NextRequest } from "next/server";
import { oauthCallback } from "@/lib/oauth-handler";

export async function GET(req: NextRequest) {
  return oauthCallback(req, "yandex");
}
