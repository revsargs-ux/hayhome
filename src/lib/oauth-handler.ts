import { NextRequest, NextResponse } from "next/server";
import { OAuthProvider, getAuthUrl, generateState, generateCodeVerifier, generateCodeChallenge, exchangeCodeForProfile } from "@/lib/oauth";
import { getUserByEmail, createUser } from "@/lib/data";
import { signToken, setAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";

/**
 * Shared OAuth login redirect handler.
 * GET /api/auth/{provider} → redirect to provider consent screen.
 */
export async function oauthRedirect(req: NextRequest, provider: OAuthProvider) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  // Store state + verifier in cookies for the callback
  const res = NextResponse.redirect(new URL(getAuthUrl(provider, state, codeChallenge), req.url));
  res.cookies.set("oauth_state", state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 600, path: "/" });
  res.cookies.set("oauth_verifier", codeVerifier, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 600, path: "/" });
  res.cookies.set("oauth_provider", provider, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 600, path: "/" });
  return res;
}

/**
 * Shared OAuth callback handler.
 * GET /api/auth/{provider}/callback?code=XXX → exchange → find/create user → set cookie → redirect.
 */
export async function oauthCallback(req: NextRequest, provider: OAuthProvider) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get("host") || "hay-home.com"}`;
  const dashboardUrl = `${baseUrl}/dashboard`;
  const loginUrl = `${baseUrl}/login?error=oauth_failed`;

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");

  // Telegram uses tg_auth_result param
  const tgAuthResult = req.nextUrl.searchParams.get("tg_auth_result");

  const savedState = req.cookies.get("oauth_state")?.value;
  const codeVerifier = req.cookies.get("oauth_verifier")?.value;

  // Verify state (skip for Telegram which uses different flow)
  if (provider !== "telegram") {
    if (!code || !state || state !== savedState) {
      return NextResponse.redirect(loginUrl);
    }
  }

  try {
    let profile;
    if (provider === "telegram") {
      if (!tgAuthResult) {
        return NextResponse.redirect(loginUrl);
      }
      profile = await exchangeCodeForProfile("telegram", tgAuthResult);
    } else {
      profile = await exchangeCodeForProfile(provider, code!, codeVerifier);
    }

    // Find or create user
    let user = await getUserByEmail(profile.email);

    if (!user) {
      // Create new user with a random password hash (not usable for login)
      const randomPassword = await bcrypt.hash(cryptoRandom(32), 10);
      user = await createUser({
        name: profile.name,
        email: profile.email,
        password: randomPassword,
        role: "guest",
      });
    }

    // Sign JWT
    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    // Redirect to dashboard with auth cookie
    const res = NextResponse.redirect(dashboardUrl);
    setAuthCookie(res, token);
    // Clean up OAuth cookies
    res.cookies.delete("oauth_state");
    res.cookies.delete("oauth_verifier");
    res.cookies.delete("oauth_provider");
    return res;
  } catch (err: any) {
    console.error(`[OAuth] ${provider} callback error:`, err.message);
    return NextResponse.redirect(`${loginUrl}&provider=${provider}`);
  }
}

/**
 * Handle Apple's form_post response mode.
 * Apple POSTs the code and state to the callback URL.
 */
export async function oauthCallbackPost(req: NextRequest, provider: OAuthProvider) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `https://${req.headers.get("host") || "hay-home.com"}`;
  const dashboardUrl = `${baseUrl}/dashboard`;
  const loginUrl = `${baseUrl}/login?error=oauth_failed`;

  const body = await req.formData();
  const code = body.get("code") as string;
  const state = body.get("state") as string;
  const savedState = req.cookies.get("oauth_state")?.value;

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(loginUrl);
  }

  try {
    const profile = await exchangeCodeForProfile(provider, code);

    let user = await getUserByEmail(profile.email);
    if (!user) {
      const randomPassword = await bcrypt.hash(cryptoRandom(32), 10);
      user = await createUser({
        name: profile.name,
        email: profile.email,
        password: randomPassword,
        role: "guest",
      });
    }

    const token = await signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const res = NextResponse.redirect(dashboardUrl);
    setAuthCookie(res, token);
    res.cookies.delete("oauth_state");
    res.cookies.delete("oauth_verifier");
    res.cookies.delete("oauth_provider");
    return res;
  } catch (err: any) {
    console.error(`[OAuth] ${provider} POST callback error:`, err.message);
    return NextResponse.redirect(`${loginUrl}&provider=${provider}`);
  }
}

function cryptoRandom(length: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}
