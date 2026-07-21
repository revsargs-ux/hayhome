/**
 * @critical
 * Услуги провайдера — управление и просмотр
 */
import { test, expect } from "@playwright/test";
import { authAs } from "../fixtures/auth";

test.describe("@critical Provider — услуги", () => {
  test("@critical неавторизованный — редирект на логин", async ({ page }) => {
    await page.goto("/provider");
    await expect(page).toHaveURL(/\/login|\/403/, { timeout: 10000 });
  });

  test("@critical guest не может зайти в /provider", async ({ browser }) => {
    const context = await authAs(browser, "guest");
    const page = await context.newPage();
    await page.goto("/provider");
    await page.waitForLoadState("networkidle");

    const url = page.url();
    const body = await page.textContent("body");
    const isBlocked = url.includes("/login") || url.includes("/403") ||
      body?.includes("403") || body?.includes("Forbidden");
    expect(isBlocked).toBeTruthy();
    await context.close();
  });

  test("@critical provider видит свой дашборд", async ({ browser }) => {
    const context = await authAs(browser, "provider");
    const page = await context.newPage();
    await page.goto("/provider");
    await page.waitForLoadState("networkidle");

    expect(page.url()).not.toMatch(/\/login/);
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500|403/);
    await context.close();
  });

  test("provider видит список своих услуг", async ({ browser }) => {
    const context = await authAs(browser, "provider");
    const page = await context.newPage();
    await page.goto("/provider/services");
    await page.waitForLoadState("networkidle");

    expect(page.url()).not.toMatch(/\/login/);
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500|403/);
    await context.close();
  });

  test("GET /api/requests — публичный доступ к заявкам", async ({ request }) => {
    const res = await request.get("/api/requests");
    expect([200, 404]).toContain(res.status());
    if (res.status() === 200) {
      const data = await res.json();
      expect(Array.isArray(data)).toBeTruthy();
    }
  });

  test("POST /api/requests без авторизации — 401", async ({ request }) => {
    const res = await request.post("/api/requests", {
      data: { title: "Тест", description: "Описание заявки для теста" },
    });
    expect(res.status()).toBe(401);
  });
});
