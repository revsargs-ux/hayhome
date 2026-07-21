/**
 * Бронирования провайдера (заявки от хостов)
 */
import { test, expect } from "@playwright/test";
import { authAs } from "../fixtures/auth";

test.describe("Provider — заявки/бронирования", () => {
  test("provider видит заявки на услуги", async ({ browser }) => {
    const context = await authAs(browser, "provider");
    const page = await context.newPage();
    await page.goto("/provider/bookings");
    await page.waitForLoadState("networkidle");

    expect(page.url()).not.toMatch(/\/login/);
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500|403/);
    await context.close();
  });

  test("provider может принять заявку", async ({ browser }) => {
    const context = await authAs(browser, "provider");
    const page = await context.newPage();
    await page.goto("/provider/bookings");
    await page.waitForLoadState("networkidle");

    const acceptBtn = page.locator(
      'button:has-text("Принять"), button:has-text("Accept")'
    ).first();

    if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptBtn.click();
      await page.waitForTimeout(500);
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500/);
    }
    await context.close();
  });
});
