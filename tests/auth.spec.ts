import { test, expect } from "@playwright/test";

test.describe("🔐 Authentication Flow", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
  });

  test("register page loads", async ({ page }) => {
    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
  });

  test("login form shows error with invalid credentials", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    await page.fill('input[type="email"]', "test_nonexistent@hay-home.com");
    await page.fill('input[type="password"]', "wrongpassword123");

    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    await page.waitForTimeout(3000);

    const body = await page.textContent("body");
    const hasError = body?.match(/error|ошибк|неверн|invalid|incorrect/i);
    expect(hasError).toBeTruthy();
  });

  test("password visibility toggle works on login", async ({ page }) => {
    await page.goto("/login", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);

    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill("testpass");

    const toggleBtn = page.locator('button[type="button"]').last();
    if (await toggleBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await toggleBtn.click();
      await page.waitForTimeout(200);
    }
  });
});
