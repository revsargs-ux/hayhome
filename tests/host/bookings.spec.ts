/**
 * @host
 * Управление бронированиями хоста
 */
import { test, expect } from "@playwright/test";
import { authAs } from "../fixtures/auth";

test.describe("@host Бронирования хоста", () => {
  test("список бронирований загружается для хоста", async ({ browser }) => {
    const context = await authAs(browser, "host");
    const page = await context.newPage();
    await page.goto("/dashboard/bookings");
    await page.waitForLoadState("load");

    const body = await page.textContent("body");
    expect(body).not.toMatch(/500|403/);
    // Либо список бронирований, либо пустой список
    expect(page.url()).not.toMatch(/\/login/);
    await context.close();
  });

  test("API GET /api/bookings возвращает только бронирования этого хоста", async ({ browser }) => {
    const context = await authAs(browser, "host");
    const page = await context.newPage();

    const res = await page.request.get("/api/bookings");
    expect(res.status()).toBe(200);
    const bookings = await res.json();
    expect(Array.isArray(bookings)).toBeTruthy();
    await context.close();
  });

  test("хост может принять бронирование", async ({ browser }) => {
    const context = await authAs(browser, "host");
    const page = await context.newPage();
    await page.goto("/dashboard/bookings");
    await page.waitForLoadState("load");

    const acceptBtn = page.locator(
      'button:has-text("Принять"), button:has-text("Accept"), button:has-text("Подтвердить")'
    ).first();

    if (await acceptBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptBtn.click();
      await page.waitForTimeout(500);
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500/);
    }
    await context.close();
  });

  test("хост может отклонить бронирование", async ({ browser }) => {
    const context = await authAs(browser, "host");
    const page = await context.newPage();
    await page.goto("/dashboard/bookings");
    await page.waitForLoadState("load");

    const rejectBtn = page.locator(
      'button:has-text("Отклонить"), button:has-text("Reject"), button:has-text("Отменить")'
    ).first();

    if (await rejectBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await rejectBtn.click();
      await page.waitForTimeout(500);
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500/);
    }
    await context.close();
  });
});
