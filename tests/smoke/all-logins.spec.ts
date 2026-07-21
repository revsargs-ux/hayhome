/**
 * @smoke @critical
 * Проверяет вход всех ролей (через API) и UI-редирект (одна роль)
 * Запуск: npx playwright test --grep @smoke
 */
import { test, expect } from "@playwright/test";
import { TEST_USERS, BASE_URL, COOKIE_NAME } from "../config";

// Сохранённый токен из UI-логин теста — переиспользуется в logout-тесте
// (работает в serial-режиме: все тесты файла выполняются в одном worker-процессе)
let savedAuthToken = "";

// Тесты выполняются последовательно — иначе rate limit (5/min) блокирует параллельные запросы
test.describe.configure({ mode: "serial" });

// Логин-тесты только на chromium — mobile дублирует запросы и исчерпывает rate limit
test.skip(({ browserName }) => browserName !== "chromium", "Login rate-limit: run on chromium only");

type Role = keyof typeof TEST_USERS;

// ─── Уровень 1: API-логин для каждой роли ────────────────────────────────────
// Проверяем что сервер отвечает 200 и устанавливает httpOnly-куку

for (const role of ["guest", "host", "admin", "provider"] as Role[]) {
  test(`@smoke @critical API-логин роли "${role}" — 200 + httpOnly кука`, async ({ request }) => {
    const creds = TEST_USERS[role];
    const res = await request.post("/api/auth/login", {
      data: { email: creds.email, password: creds.password },
    });

    expect(res.status()).toBe(200);

    const body = await res.json();
    expect(body.role).toBe(creds.role);
    expect(body.email).toBe(creds.email);

    // Playwright request context хранит куки автоматически
    const cookies = await request.storageState();
    const auth = cookies.cookies.find((c) => c.name === COOKIE_NAME);
    expect(auth).toBeTruthy();
  });
}

// ─── Уровень 2: UI-логин и редирект (только guest, одна попытка) ──────────────
test("@smoke @critical UI-логин guest → редирект на /dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.waitForLoadState("load");

  // pressSequentially шлёт реальные keystroke-события — работает с React 19 controlled inputs
  const emailInput = page.locator('input[type="email"]');
  await emailInput.waitFor({ state: "visible", timeout: 10000 });
  await emailInput.click();
  await emailInput.pressSequentially(TEST_USERS.guest.email);

  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.click();
  await passwordInput.pressSequentially(TEST_USERS.guest.password);

  await page.click('button[type="submit"]');

  // Ждём уход со страницы логина
  await page.waitForURL(/\/dashboard|\/hosts/, { timeout: 15000 });
  expect(page.url()).not.toContain("/login");

  // Сохраняем токен для logout-теста (без нового API-запроса)
  const cookies = await page.context().cookies();
  const auth = cookies.find((c) => c.name === COOKIE_NAME);
  savedAuthToken = auth?.value || "";
});

// ─── Уровень 3: выход из системы ─────────────────────────────────────────────
test("@smoke @critical выход из системы удаляет куку", async ({ page }) => {
  // Переиспользуем токен из UI-логин теста — без нового запроса к rate-limited API
  if (!savedAuthToken) {
    console.warn("Нет сохранённого токена (UI-логин не прошёл) — пропуск logout-теста");
    test.skip();
    return;
  }

  await page.context().addCookies([
    {
      name: COOKIE_NAME,
      value: savedAuthToken,
      domain: new URL(BASE_URL).hostname,
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  await page.goto("/dashboard");
  await page.waitForLoadState("load");

  // Выход
  const logoutBtn = page.locator(
    '[href="/logout"], button:has-text("Выйти"), a:has-text("Logout"), a:has-text("Выйти")'
  ).first();
  if (await logoutBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await logoutBtn.click();
  } else {
    await page.request.post("/api/auth/logout");
  }

  // После logout должен перейти на логин
  // ERR_ABORTED — ожидаемо: Next.js middleware редиректит через 307,
  // что Playwright иногда воспринимает как abort. Проверяем URL после.
  await page.goto("/dashboard").catch(() => {});
  await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
});
