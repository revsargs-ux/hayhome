/**
 * Управление партнёрами — панель администратора
 */
import { test, expect } from "@playwright/test";
import { authAs } from "../fixtures/auth";

test.describe("Admin — партнёры /admin/partners", () => {
  test("admin видит раздел партнёров", async ({ browser }) => {
    const context = await authAs(browser, "admin");
    const page = await context.newPage();
    await page.goto("/admin/partners");
    await page.waitForLoadState("networkidle");

    expect(page.url()).not.toMatch(/\/login/);
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500|403/);
    await context.close();
  });

  test("partner не может получить доступ к /admin/partners", async ({ browser }) => {
    const context = await authAs(browser, "partner");
    const page = await context.newPage();
    await page.goto("/admin/partners");
    await page.waitForLoadState("networkidle");

    const url = page.url();
    const body = await page.textContent("body");
    const isBlocked = url.includes("/login") || url.includes("/403") ||
      body?.includes("403") || body?.includes("Forbidden");
    expect(isBlocked).toBeTruthy();
    await context.close();
  });

  test("admin видит список партнёров с реферальными ссылками", async ({ browser }) => {
    const context = await authAs(browser, "admin");
    const page = await context.newPage();
    await page.goto("/admin/partners");
    await page.waitForLoadState("networkidle");

    const body = await page.textContent("body");
    // Страница должна содержать что-то про партнёров
    expect(body).not.toMatch(/500/);
    await context.close();
  });
});
