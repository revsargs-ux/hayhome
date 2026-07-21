/**
 * @login
 * UI-тесты авторизации: логин, регистрация, ошибки
 */
import { test, expect } from "@playwright/test";
import { BASE_URL, TEST_USERS } from "../config";

async function fillEmail(page: import("@playwright/test").Page, selector: string, value: string) {
  const el = page.locator(selector).first();
  await el.waitFor({ state: "visible", timeout: 5000 });
  await el.click();
  await el.pressSequentially(value);
}

test.describe("Страница логина /login", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("load");
  });

  test("@login страница загружается", async ({ page }) => {
    await expect(page.locator("form")).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("@login неверный пароль — показывает ошибку", async ({ page }) => {
    await fillEmail(page, 'input[type="email"]', "wrong@example.com");
    await page.fill('input[type="password"]', "wrongpassword");
    await page.click('button[type="submit"]');

    const error = page.locator('[role="alert"], .error, [class*="error"], [class*="alert"]').first();
    await expect(error).toBeVisible({ timeout: 8000 });
  });

  test("@login кнопка показа пароля работает", async ({ page }) => {
    const toggleBtn = page.locator('button[aria-label*="пароль" i], button[aria-label*="password" i]').first();

    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await expect(page.locator('input[type="text"]').first()).toBeVisible();
    }
  });

  test("@login успешный вход — гость", async ({ page }) => {
    await fillEmail(page, 'input[type="email"]', TEST_USERS.guest.email);
    await page.fill('input[type="password"]', TEST_USERS.guest.password);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/dashboard|\/hosts|\//, { timeout: 15000 });

    const cookies = await page.context().cookies();
    const auth = cookies.find((c) => c.name === "hayhome_auth");
    expect(auth).toBeTruthy();
    expect(auth?.httpOnly).toBe(true);
  });

  test("@login ссылка на регистрацию присутствует", async ({ page }) => {
    const link = page.locator('a[href="/register"], a:has-text("Регистрация"), a:has-text("Register")').first();
    await expect(link).toBeVisible();
  });
});

test.describe("Страница регистрации /register", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("load");
  });

  test("@login форма регистрации загружается", async ({ page }) => {
    await expect(page.locator("form")).toBeVisible({ timeout: 10000 });
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("@login слабый пароль (5 символов) — показывает ошибку", async ({ page }) => {
    await page.fill('input[name="name"], input[placeholder*="имя" i], input[placeholder*="name" i]', "Test User");
    await fillEmail(page, 'input[type="email"]', `testuser_${Date.now()}@test.com`);
    await page.fill('input[type="password"]', "abc12");
    await page.click('button[type="submit"]');

    const error = page.locator('[role="alert"], .error, [class*="error"]').first();
    await expect(error).toBeVisible({ timeout: 8000 });
  });

  test("@login регистрация с существующим email — показывает ошибку", async ({ page }) => {
    await page.fill('input[name="name"], input[placeholder*="имя" i], input[placeholder*="name" i]', "Existing User");
    await fillEmail(page, 'input[type="email"]', TEST_USERS.guest.email);
    await page.fill('input[type="password"]', "password123");
    await page.click('button[type="submit"]');

    const error = page.locator('[role="alert"], .error, [class*="error"]').first();
    await expect(error).toBeVisible({ timeout: 8000 });
  });
});
