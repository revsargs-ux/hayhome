/**
 * @critical
 * Дашборд администратора
 */
import { test, expect } from "@playwright/test";
import { authAs } from "../fixtures/auth";

test.describe("Дашборд администратора /admin", () => {
  test("@critical неавторизованный — редирект на логин", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login|\/403/, { timeout: 10000 });
  });

  test("@critical гость не может зайти в /admin", async ({ browser }) => {
    const context = await authAs(browser, "guest");
    const page = await context.newPage();
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    const url = page.url();
    const body = await page.textContent("body");
    const isBlocked = url.includes("/login") || url.includes("/403") ||
      body?.includes("403") || body?.includes("Доступ запрещён") || body?.includes("Forbidden");
    expect(isBlocked).toBeTruthy();
    await context.close();
  });

  test("@critical хост не может зайти в /admin", async ({ browser }) => {
    const context = await authAs(browser, "host");
    const page = await context.newPage();
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    const url = page.url();
    const body = await page.textContent("body");
    const isBlocked = url.includes("/login") || url.includes("/403") ||
      body?.includes("403") || body?.includes("Доступ запрещён") || body?.includes("Forbidden");
    expect(isBlocked).toBeTruthy();
    await context.close();
  });

  test("@critical admin видит дашборд", async ({ browser }) => {
    const context = await authAs(browser, "admin");
    const page = await context.newPage();
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    expect(page.url()).not.toMatch(/\/login/);
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500|403/);
    await context.close();
  });

  test("admin видит статистику (хосты, бронирования, пользователи)", async ({ browser }) => {
    const context = await authAs(browser, "admin");
    const page = await context.newPage();
    await page.goto("/admin");
    await page.waitForLoadState("networkidle");

    const body = await page.textContent("body");
    const hasStats = /хост|booking|пользовател|user|всего|total|статистика/i.test(body || "");
    expect(hasStats).toBeTruthy();
    await context.close();
  });

  test("admin видит API GET /api/hosts?all=true", async ({ browser }) => {
    const context = await authAs(browser, "admin");
    const page = await context.newPage();
    const res = await page.request.get("/api/hosts?all=true");
    expect(res.status()).toBe(200);
    await context.close();
  });
});
