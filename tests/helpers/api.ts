import { BASE_URL, COOKIE_NAME, TEST_USERS } from "../config";

type Role = keyof typeof TEST_USERS;

// Универсальный fetch с куками
export async function apiFetch(
  path: string,
  options: RequestInit & { cookie?: string } = {}
): Promise<Response> {
  const { cookie, ...rest } = options;
  return fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(cookie ? { Cookie: `${COOKIE_NAME}=${cookie}` } : {}),
      ...rest.headers,
    },
  });
}

// Залогиниться и получить токен
export async function getToken(role: Role): Promise<string> {
  const creds = TEST_USERS[role];
  const res = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: creds.email, password: creds.password }),
  });
  if (!res.ok) {
    throw new Error(
      `getToken(${role}): ${res.status}. ` +
      `Убедись что ${creds.email} существует в hayhome_users`
    );
  }
  const setCookie = res.headers.get("set-cookie") || "";
  const match = setCookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return match?.[1] || "";
}

// POST с телом
export async function post(path: string, body: unknown, cookie?: string) {
  return apiFetch(path, {
    method: "POST",
    body: JSON.stringify(body),
    cookie,
  });
}

// GET с необязательным токеном
export async function get(path: string, cookie?: string) {
  return apiFetch(path, { method: "GET", cookie });
}

// DELETE
export async function del(path: string, body?: unknown, cookie?: string) {
  return apiFetch(path, {
    method: "DELETE",
    body: body ? JSON.stringify(body) : undefined,
    cookie,
  });
}

// PATCH
export async function patch(path: string, body: unknown, cookie?: string) {
  return apiFetch(path, {
    method: "PATCH",
    body: JSON.stringify(body),
    cookie,
  });
}

// Зарегистрировать и вернуть токен (для cleanup-тестов)
export async function registerAndGetToken(overrides: Partial<{
  name: string; email: string; password: string; role: string;
}> = {}): Promise<{ token: string; userId: string; email: string }> {
  const email = overrides.email || `test.tmp.${Date.now()}@hay-home.com`;
  const res = await post("/api/auth/register", {
    name: overrides.name || "Temp Test User",
    email,
    password: overrides.password || "testpass123",
    role: overrides.role || "guest",
  });
  if (!res.ok) throw new Error(`register failed: ${res.status} ${await res.text()}`);
  const data = await res.json();
  const setCookie = res.headers.get("set-cookie") || "";
  const match = setCookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  return { token: match?.[1] || "", userId: data.id, email };
}
