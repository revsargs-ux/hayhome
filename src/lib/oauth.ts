/**
 * OAuth helper library — manual redirect-based OAuth for 6 providers.
 * No external dependencies beyond jose (already in project).
 */

export type OAuthProvider = "google" | "facebook" | "yandex" | "vk" | "apple" | "telegram";

export interface OAuthUserProfile {
  email: string;
  name: string;
  picture?: string;
  provider: OAuthProvider;
  providerUserId: string;
}

export interface ProviderConfig {
  enabled: boolean;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "";

function getRedirectUri(provider: OAuthProvider): string {
  const base = BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
  if (base) return `${base}/api/auth/${provider}/callback`;
  // Fallback for local dev — will be replaced at runtime
  return `/api/auth/${provider}/callback`;
}

/** Get the configured base URL for redirects */
export function getBaseUrl(): string {
  return BASE_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") || "https://hay-home.com";
}

// ============================================
// Provider configs
// ============================================

export function getProviderConfig(provider: OAuthProvider): ProviderConfig | null {
  const redirectUri = `${getBaseUrl()}/api/auth/${provider}/callback`;

  switch (provider) {
    case "google":
      if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) return null;
      return { enabled: true, clientId: process.env.GOOGLE_CLIENT_ID, clientSecret: process.env.GOOGLE_CLIENT_SECRET, redirectUri };

    case "facebook":
      if (!process.env.FACEBOOK_APP_ID || !process.env.FACEBOOK_APP_SECRET) return null;
      return { enabled: true, clientId: process.env.FACEBOOK_APP_ID, clientSecret: process.env.FACEBOOK_APP_SECRET, redirectUri };

    case "yandex":
      if (!process.env.YANDEX_CLIENT_ID || !process.env.YANDEX_CLIENT_SECRET) return null;
      return { enabled: true, clientId: process.env.YANDEX_CLIENT_ID, clientSecret: process.env.YANDEX_CLIENT_SECRET, redirectUri };

    case "vk":
      if (!process.env.VK_CLIENT_ID || !process.env.VK_CLIENT_SECRET) return null;
      return { enabled: true, clientId: process.env.VK_CLIENT_ID, clientSecret: process.env.VK_CLIENT_SECRET, redirectUri };

    case "apple":
      if (!process.env.APPLE_CLIENT_ID || !process.env.APPLE_TEAM_ID || !process.env.APPLE_KEY_ID || !process.env.APPLE_PRIVATE_KEY) return null;
      return { enabled: true, clientId: process.env.APPLE_CLIENT_ID, clientSecret: "", redirectUri };

    case "telegram":
      if (!process.env.TELEGRAM_BOT_TOKEN) return null;
      return { enabled: true, clientId: process.env.TELEGRAM_BOT_TOKEN.split(":")[0], clientSecret: process.env.TELEGRAM_BOT_TOKEN, redirectUri };

    default:
      return null;
  }
}

/** Check which providers are configured */
export function getEnabledProviders(): OAuthProvider[] {
  const providers: OAuthProvider[] = ["google", "facebook", "yandex", "vk", "apple", "telegram"];
  return providers.filter((p) => getProviderConfig(p) !== null);
}

// ============================================
// State / PKCE helpers
// ============================================

export function generateState(): string {
  return cryptoRandom(32);
}

export function generateCodeVerifier(): string {
  return cryptoRandom(64);
}

export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return base64UrlEncode(new Uint8Array(hash));
}

function cryptoRandom(length: number): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return base64UrlEncode(bytes);
}

function base64UrlEncode(bytes: Uint8Array): string {
  let str = "";
  for (const b of bytes) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// ============================================
// Generate Authorization URLs
// ============================================

export function getAuthUrl(provider: OAuthProvider, state: string, codeChallenge?: string): string {
  const config = getProviderConfig(provider);
  if (!config) throw new Error(`Provider ${provider} not configured`);

  const redirectUri = encodeURIComponent(config.redirectUri);

  switch (provider) {
    case "google": {
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        scope: "openid email profile",
        state,
        ...(codeChallenge ? { code_challenge: codeChallenge, code_challenge_method: "S256" } : {}),
      });
      return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    }

    case "facebook": {
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        scope: "email",
        state,
      });
      return `https://www.facebook.com/v18.0/dialog/oauth?${params}`;
    }

    case "yandex": {
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        state,
      });
      return `https://oauth.yandex.ru/authorize?${params}`;
    }

    case "vk": {
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code",
        scope: "email",
        state,
      });
      return `https://oauth.vk.com/authorize?${params}`;
    }

    case "apple": {
      const params = new URLSearchParams({
        client_id: config.clientId,
        redirect_uri: config.redirectUri,
        response_type: "code id_token",
        scope: "email name",
        state,
        response_mode: "form_post",
      });
      return `https://appleid.apple.com/auth/authorize?${params}`;
    }

    case "telegram": {
      // Telegram uses a different OAuth flow
      const botId = config.clientId;
      const origin = encodeURIComponent(getBaseUrl());
      return `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${origin}&embed=0&request_access=write`;
    }

    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// ============================================
// Exchange code for tokens & get user profile
// ============================================

export async function exchangeCodeForProfile(
  provider: OAuthProvider,
  code: string,
  codeVerifier?: string
): Promise<OAuthUserProfile> {
  switch (provider) {
    case "google":
      return googleExchange(code, codeVerifier);
    case "facebook":
      return facebookExchange(code);
    case "yandex":
      return yandexExchange(code);
    case "vk":
      return vkExchange(code);
    case "apple":
      return appleExchange(code);
    case "telegram":
      return telegramProfile(code);
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }
}

// ============================================
// Provider-specific exchange functions
// ============================================

async function googleExchange(code: string, codeVerifier?: string): Promise<OAuthUserProfile> {
  const config = getProviderConfig("google")!;
  const body: Record<string, string> = {
    client_id: config.clientId,
    client_secret: config.clientSecret,
    code,
    grant_type: "authorization_code",
    redirect_uri: config.redirectUri,
  };
  if (codeVerifier) body.code_verifier = codeVerifier;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(body),
  });

  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`Google token exchange failed: ${err}`);
  }

  const tokens = await tokenRes.json();

  // Decode ID token to get user info
  const idToken = tokens.id_token;
  if (idToken) {
    const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64").toString());
    return {
      email: payload.email,
      name: payload.name || payload.given_name || payload.email,
      picture: payload.picture,
      provider: "google",
      providerUserId: payload.sub,
    };
  }

  // Fallback: use access token to get userinfo
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });
  const user = await userRes.json();
  return {
    email: user.email,
    name: user.name || user.email,
    picture: user.picture,
    provider: "google",
    providerUserId: user.id,
  };
}

async function facebookExchange(code: string): Promise<OAuthUserProfile> {
  const config = getProviderConfig("facebook")!;

  const tokenRes = await fetch(
    `https://graph.facebook.com/v18.0/oauth/access_token?client_id=${config.clientId}&client_secret=${config.clientSecret}&redirect_uri=${encodeURIComponent(config.redirectUri)}&code=${encodeURIComponent(code)}`
  );

  if (!tokenRes.ok) throw new Error("Facebook token exchange failed");
  const tokens = await tokenRes.json();

  const userRes = await fetch(
    `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${tokens.access_token}`
  );
  const user = await userRes.json();

  return {
    email: user.email,
    name: user.name || user.email,
    picture: user.picture?.data?.url,
    provider: "facebook",
    providerUserId: user.id,
  };
}

async function yandexExchange(code: string): Promise<OAuthUserProfile> {
  const config = getProviderConfig("yandex")!;

  const tokenRes = await fetch("https://oauth.yandex.ru/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString("base64")}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
    }),
  });

  if (!tokenRes.ok) throw new Error("Yandex token exchange failed");
  const tokens = await tokenRes.json();

  const userRes = await fetch("https://login.yandex.ru/info", {
    headers: { Authorization: `OAuth ${tokens.access_token}` },
  });
  const user = await userRes.json();

  return {
    email: user.default_email || user.emails?.[0] || `${user.id}@yandex.ru`,
    name: user.real_name || user.display_name || user.login || "User",
    picture: user.default_avatar_id ? `https://avatars.yandex.net/get-yapic/${user.default_avatar_id}/islands-200` : undefined,
    provider: "yandex",
    providerUserId: String(user.id),
  };
}

async function vkExchange(code: string): Promise<OAuthUserProfile> {
  const config = getProviderConfig("vk")!;

  const tokenRes = await fetch(
    `https://oauth.vk.com/access_token?client_id=${config.clientId}&client_secret=${config.clientSecret}&redirect_uri=${encodeURIComponent(config.redirectUri)}&code=${encodeURIComponent(code)}`
  );

  if (!tokenRes.ok) throw new Error("VK token exchange failed");
  const tokens = await tokenRes.json();

  const userId = tokens.user_id;
  const email = tokens.email || `${userId}@vk.com`;

  // Get user info
  const userRes = await fetch(
    `https://api.vk.com/method/users.get?user_ids=${userId}&fields=photo_200,first_name,last_name&v=5.131&access_token=${tokens.access_token}`
  );
  const userData = await userRes.json();
  const user = userData.response?.[0] || {};

  return {
    email,
    name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || email,
    picture: user.photo_200,
    provider: "vk",
    providerUserId: String(userId),
  };
}

async function appleExchange(code: string): Promise<OAuthUserProfile> {
  const config = getProviderConfig("apple")!;

  // Generate Apple client_secret JWT
  const clientSecret = await generateAppleClientSecret();

  const tokenRes = await fetch("https://appleid.apple.com/auth/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: config.clientId,
      client_secret: clientSecret,
      code,
      grant_type: "authorization_code",
      redirect_uri: config.redirectUri,
    }),
  });

  if (!tokenRes.ok) throw new Error("Apple token exchange failed");
  const tokens = await tokenRes.json();

  // Decode ID token
  const idToken = tokens.id_token;
  if (!idToken) throw new Error("Apple: no id_token in response");

  const payload = JSON.parse(Buffer.from(idToken.split(".")[1], "base64").toString());

  return {
    email: payload.email,
    name: payload.name || payload.email,
    provider: "apple",
    providerUserId: payload.sub,
  };
}

async function generateAppleClientSecret(): Promise<string> {
  const { SignJWT } = await import("jose");

  const teamId = process.env.APPLE_TEAM_ID!;
  const keyId = process.env.APPLE_KEY_ID!;
  const clientId = process.env.APPLE_CLIENT_ID!;
  const privateKey = process.env.APPLE_PRIVATE_KEY!.replace(/\\n/g, "\n");

  const key = await crypto.subtle.importKey(
    "pkcs8",
    new TextEncoder().encode(privateKey),
    { name: "ECDSA", namedCurve: "P-256" },
    false,
    ["sign"]
  );

  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({})
    .setProtectedHeader({ alg: "ES256", kid: keyId })
    .setIssuer(teamId)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .setAudience("https://appleid.apple.com")
    .setSubject(clientId)
    .sign(key);
}

async function telegramProfile(authResult: string): Promise<OAuthUserProfile> {
  // Telegram redirects with tg_auth_result (base64 encoded)
  const decoded = JSON.parse(Buffer.from(authResult, "base64").toString());

  // Verify the hash
  const botToken = process.env.TELEGRAM_BOT_TOKEN!;
  const { createHmac, createHash } = await import("crypto");

  const { hash, ...userData } = decoded;
  const dataCheckString = Object.keys(userData)
    .sort()
    .map((k) => `${k}=${userData[k]}`)
    .join("\n");

  const secretKey = createHmac("sha256", "Web App Data").update(botToken).digest();
  const computedHash = createHmac("sha256", secretKey).update(dataCheckString).digest("hex");

  if (computedHash !== hash) {
    throw new Error("Telegram auth verification failed");
  }

  return {
    email: decoded.email || `${decoded.id}@telegram.org`,
    name: decoded.first_name ? `${decoded.first_name} ${decoded.last_name || ""}`.trim() : `Telegram User ${decoded.id}`,
    picture: decoded.photo_url,
    provider: "telegram",
    providerUserId: String(decoded.id),
  };
}

// ============================================
// Get available providers for client-side
// ============================================

export function getAvailableProviders(): string[] {
  return getEnabledProviders().map((p) => p);
}
