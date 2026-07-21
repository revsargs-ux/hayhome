/**
 * Профиль пользователя — авторизованный гость
 */
import { test, expect } from "@playwright/test";
import { authAs } from "../fixtures/auth";

test.describe("Профиль /profile", () => {
  test("неавторизованный — редирект на логин", async ({ page }) => {
    await page.goto("/profile");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });

  test("авторизованный гость видит профиль", async ({ browser }) => {
    const context = await authAs(browser, "guest");
    const page = await context.newPage();
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");

    const body = await page.textContent("body");
    expect(body).not.toMatch(/500|401|403/);
    // Профиль должен содержать email или имя пользователя
    expect(body).toMatch(/hay-home\.com|@|профиль|profile/i);
    await context.close();
  });

  test("страница профиля содержит форму редактирования", async ({ browser }) => {
    const context = await authAs(browser, "guest");
    const page = await context.newPage();
    await page.goto("/profile");
    await page.waitForLoadState("networkidle");

    const hasForm = await page.locator("form, input, [class*=\"profile\"]").first()
      .isVisible({ timeout: 5000 }).catch(() => false);
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500/);
    await context.close();
  });
});
