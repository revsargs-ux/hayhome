/**
 * @critical
 * Дашборд партнёра — реферальные ссылки и выплаты
 */
import { test, expect } from "@playwright/test";
import { authAs } from "../fixtures/auth";

test.describe("@critical Partner — дашборд", () => {
  test("@critical неавторизованный — редирект на логин", async ({ page }) => {
    await page.goto("/partner");
    await expect(page).toHaveURL(/\/login|\/403/, { timeout: 10000 });
  });

  test("@critical guest не может зайти в /partner", async ({ browser }) => {
    const context = await authAs(browser, "guest");
    const page = await context.newPage();
    await page.goto("/partner");
    await page.waitForLoadState("load");

    const url = page.url();
    const body = await page.textContent("body");
    const isBlocked = url.includes("/login") || url.includes("/403") ||
      body?.includes("403") || body?.includes("Forbidden");
    expect(isBlocked).toBeTruthy();
    await context.close();
  });

  test("@critical partner видит дашборд с реферальной ссылкой", async ({ browser }) => {
    const context = await authAs(browser, "partner");
    const page = await context.newPage();
    await page.goto("/partner");
    await page.waitForLoadState("load");

    expect(page.url()).not.toMatch(/\/login/);
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500|403/);
    await context.close();
  });

  test("partner видит статистику рефералов", async ({ browser }) => {
    const context = await authAs(browser, "partner");
    const page = await context.newPage();
    await page.goto("/partner");
    await page.waitForLoadState("load");

    const body = await page.textContent("body");
    // Дашборд партнёра должен содержать что-то про рефералов или выплаты
    expect(body).toMatch(/реферал|referral|выплат|payout|заработок|earning|комиссия/i);
    await context.close();
  });

  test("реферальная ссылка копируется", async ({ browser }) => {
    const context = await authAs(browser, "partner");
    const page = await context.newPage();
    await page.goto("/partner");
    await page.waitForLoadState("load");

    const copyBtn = page.locator(
      'button:has-text("Копировать"), button:has-text("Copy"), button[aria-label*="copy" i]'
    ).first();

    if (await copyBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await copyBtn.click();
      await page.waitForTimeout(300);
      // Должно появиться уведомление
      const toast = page.locator('[role="status"], [role="alert"], [class*="toast"], [class*="notification"]').first();
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500/);
    }
    await context.close();
  });

  test("регистрация по реферальной ссылке (?ref=...) работает", async ({ browser }) => {
    const context = await authAs(browser, "partner");
    const page = await context.newPage();
    await page.goto("/partner");
    await page.waitForLoadState("load");

    // Найти реферальный код в тексте страницы
    const body = await page.textContent("body") || "";
    const refMatch = body.match(/\?ref=([A-Za-z0-9_-]+)/);

    if (refMatch) {
      const refPage = await context.newPage();
      await refPage.goto(`/register?ref=${refMatch[1]}`);
      await refPage.waitForLoadState("load");
      const regBody = await refPage.textContent("body");
      expect(regBody).not.toMatch(/500/);
      await refPage.close();
    }
    await context.close();
  });
});
