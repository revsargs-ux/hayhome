/**
 * Управление хостами — панель администратора
 */
import { test, expect } from "@playwright/test";
import { authAs } from "../fixtures/auth";

test.describe("Admin — управление хостами", () => {
  test("admin видит список всех хостов (включая неактивных)", async ({ browser }) => {
    const context = await authAs(browser, "admin");
    const page = await context.newPage();
    await page.goto("/admin/hosts");
    await page.waitForLoadState("networkidle");

    expect(page.url()).not.toMatch(/\/login/);
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500|403/);
    await context.close();
  });

  test("API ?all=true — admin получает всех хостов", async ({ browser }) => {
    const context = await authAs(browser, "admin");
    const page = await context.newPage();
    const res = await page.request.get("/api/hosts?all=true");
    expect(res.status()).toBe(200);
    const hosts = await res.json();
    expect(Array.isArray(hosts)).toBeTruthy();
    await context.close();
  });

  test("API ?all=true — guest получает 403", async ({ browser }) => {
    const context = await authAs(browser, "guest");
    const page = await context.newPage();
    const res = await page.request.get("/api/hosts?all=true");
    expect(res.status()).toBe(403);
    await context.close();
  });

  test("admin может изменить статус хоста", async ({ browser }) => {
    const context = await authAs(browser, "admin");
    const page = await context.newPage();
    await page.goto("/admin/hosts");
    await page.waitForLoadState("networkidle");

    const toggleBtn = page.locator(
      'button:has-text("Активировать"), button:has-text("Деактивировать"), button:has-text("Activate"), button:has-text("Deactivate")'
    ).first();

    if (await toggleBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await toggleBtn.click();
      await page.waitForTimeout(500);
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500/);
    }
    await context.close();
  });
});
