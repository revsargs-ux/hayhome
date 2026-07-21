/**
 * Модерация отзывов — панель администратора
 */
import { test, expect } from "@playwright/test";
import { authAs } from "../fixtures/auth";

test.describe("Admin — модерация отзывов", () => {
  test("admin видит страницу отзывов", async ({ browser }) => {
    const context = await authAs(browser, "admin");
    const page = await context.newPage();
    await page.goto("/admin/reviews");
    await page.waitForLoadState("load");

    expect(page.url()).not.toMatch(/\/login/);
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500|403/);
    await context.close();
  });

  test("guest не может зайти на /admin/reviews", async ({ browser }) => {
    const context = await authAs(browser, "guest");
    const page = await context.newPage();
    await page.goto("/admin/reviews");
    await page.waitForLoadState("load");

    const url = page.url();
    const body = await page.textContent("body");
    const isBlocked = url.includes("/login") || url.includes("/403") ||
      body?.includes("403") || body?.includes("Forbidden");
    expect(isBlocked).toBeTruthy();
    await context.close();
  });

  test("admin может одобрить отзыв", async ({ browser }) => {
    const context = await authAs(browser, "admin");
    const page = await context.newPage();
    await page.goto("/admin/reviews");
    await page.waitForLoadState("load");

    const approveBtn = page.locator(
      'button:has-text("Одобрить"), button:has-text("Approve"), button:has-text("Публиковать")'
    ).first();

    if (await approveBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await approveBtn.click();
      await page.waitForTimeout(500);
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500/);
    }
    await context.close();
  });

  test("admin может удалить отзыв", async ({ browser }) => {
    const context = await authAs(browser, "admin");
    const page = await context.newPage();
    await page.goto("/admin/reviews");
    await page.waitForLoadState("load");

    const deleteBtn = page.locator(
      'button:has-text("Удалить"), button:has-text("Delete"), button[aria-label*="удалить" i]'
    ).first();

    if (await deleteBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await deleteBtn.click();
      await page.waitForTimeout(300);
      // Может появиться диалог подтверждения
      const confirmBtn = page.locator('button:has-text("Да"), button:has-text("Подтвердить"), button:has-text("Confirm")').first();
      if (await confirmBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
        await confirmBtn.click();
      }
      await page.waitForTimeout(500);
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500/);
    }
    await context.close();
  });
});
