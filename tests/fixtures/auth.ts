import { test as base, Browser, BrowserContext, Page } from "@playwright/test";
import { TEST_USERS, BASE_URL, COOKIE_NAME } from "../config";

type Role = keyof typeof TEST_USERS;

interface AuthFixtures {
  authAs: (role: Role) => Promise<{ page: Page; token: string; userId: string }>;
  authPage: Page;
  guestPage: Page;
  hostPage: Page;
  adminPage: Page;
  providerPage: Page;
}

// Логин через API — быстро, без UI
async function loginViaApi(
  browser: Browser,
  role: Role
): Promise<{ context: BrowserContext; page: Page; token: string; userId: string }> {
  const creds = TEST_USERS[role];

  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-test-bypass": "true",
    },
    body: JSON.stringify({ email: creds.email, password: creds.password }),
  });

  if (!res.ok) {
    throw new Error(
      `Login failed for role "${role}" (${res.status}): ${await res.text()}\n` +
      `Убедись что пользователь ${creds.email} существует в hayhome_users`
    );
  }

  const data = await res.json();
  const setCookie = res.headers.get("set-cookie") || "";
  const tokenMatch = setCookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
  const token = tokenMatch?.[1] || "";

  const isHttps = BASE_URL.startsWith("https");
  const context = await browser.newContext({
    baseURL: BASE_URL,
    storageState: {
      cookies: [
        {
          name: COOKIE_NAME,
          value: token,
          domain: new URL(BASE_URL).hostname,
          path: "/",
          httpOnly: true,
          secure: isHttps,
          sameSite: "Lax",
        },
      ],
      origins: [],
    },
  });

  const page = await context.newPage();
  return { context, page, token, userId: data.id };
}

// Standalone helper — for use outside of Playwright fixture system
export async function authAs(browser: Browser, role: Role): Promise<BrowserContext> {
  const { context } = await loginViaApi(browser, role);
  return context;
}

export const test = base.extend<AuthFixtures>({
  authAs: async ({ browser }, use) => {
    const contexts: BrowserContext[] = [];
    await use(async (role) => {
      const { context, page, token, userId } = await loginViaApi(browser, role);
      contexts.push(context);
      return { page, token, userId };
    });
    for (const ctx of contexts) await ctx.close();
  },

  authPage: async ({ browser }, use) => {
    const { context, page } = await loginViaApi(browser, "guest");
    await use(page);
    await context.close();
  },

  guestPage: async ({ browser }, use) => {
    const { context, page } = await loginViaApi(browser, "guest");
    await use(page);
    await context.close();
  },

  hostPage: async ({ browser }, use) => {
    const { context, page } = await loginViaApi(browser, "host");
    await use(page);
    await context.close();
  },

  adminPage: async ({ browser }, use) => {
    const { context, page } = await loginViaApi(browser, "admin");
    await use(page);
    await context.close();
  },

  providerPage: async ({ browser }, use) => {
    const { context, page } = await loginViaApi(browser, "provider");
    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";
