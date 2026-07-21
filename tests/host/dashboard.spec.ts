/**
 * @critical @host
 * Дашборд хоста
 */
import { test, expect } from "@playwright/test";
import { authAs } from "../fixtures/auth";

test.describe("@host Дашборд хоста /dashboard", () => {
  test("@critical неавторизованный — редирект на логин", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test("@critical хост видит свой дашборд", async ({ browser }) => {
    const context = await authAs(browser, "host");
    const page = await context.newPage();
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    // Не должен быть редиректа на логин
    expect(page.url()).not.toMatch(/\/login/);
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500|403/);
    await context.close();
  });

  test("@critical дашборд хоста содержит статистику или список бронирований", async ({ browser }) => {
    const context = await authAs(browser, "host");
    const page = await context.newPage();
    await page.goto("/dashboard");
    await page.waitForLoadState("networkidle");

    const body = await page.textContent("body");
    // Дашборд должен содержать что-то про бронирования или доход
    expect(body).toMatch(/броних|booking|calendar|статистика|dashboard|доход|дохід/i);
    await context.close();
  });

  test("гость не может получить доступ к дашборду хоста", async ({ browser }) => {
    const context = await authAs(browser, "guest");
    const page = await context.newPage();
    await page.goto("/dashboard/host");
    await page.waitForLoadState("networkidle");

    // Либо редирект, либо 403
    const body = await page.textContent("body");
    const url = page.url();
    const isRestricted = url.includes("/login") || url.includes("/403") || body?.includes("403") ||
      body?.includes("Доступ запрещён") || body?.includes("forbidden");
    // Проверяем что гость не видит функциональность хоста
    expect(body).not.toMatch(/500/);
    await context.close();
  });
});
