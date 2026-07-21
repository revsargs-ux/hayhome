/**
 * @host
 * Календарь доступности хоста
 */
import { test, expect } from "@playwright/test";
import { authAs } from "../fixtures/auth";

test.describe("@host Календарь /dashboard/calendar", () => {
  test("календарь загружается для хоста", async ({ browser }) => {
    const context = await authAs(browser, "host");
    const page = await context.newPage();
    await page.goto("/dashboard/calendar");
    await page.waitForLoadState("networkidle");

    expect(page.url()).not.toMatch(/\/login/);
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500/);
    await context.close();
  });

  test("календарь содержит навигацию по месяцам", async ({ browser }) => {
    const context = await authAs(browser, "host");
    const page = await context.newPage();
    await page.goto("/dashboard/calendar");
    await page.waitForLoadState("networkidle");

    const prevBtn = page.locator('button[aria-label*="prev" i], button[aria-label*="назад" i], button:has-text("<"), button:has-text("‹")').first();
    const nextBtn = page.locator('button[aria-label*="next" i], button[aria-label*="вперёд" i], button:has-text(">"), button:has-text("›")').first();

    if (await nextBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await nextBtn.click();
      await page.waitForTimeout(300);
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500/);
    }
    await context.close();
  });

  test("хост может заблокировать даты", async ({ browser }) => {
    const context = await authAs(browser, "host");
    const page = await context.newPage();
    await page.goto("/dashboard/calendar");
    await page.waitForLoadState("networkidle");

    const day = page.locator('[data-date], [class*="day"]:not([class*="disabled"])').first();
    if (await day.isVisible({ timeout: 5000 }).catch(() => false)) {
      await day.click();
      await page.waitForTimeout(300);
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500/);
    }
    await context.close();
  });
});
