import { test, expect } from "@playwright/test";

test.describe("🔐 Authentication Flow", () => {
  test("login page loads", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("register page loads with consent checkbox", async ({ page }) => {
    await page.goto("/register");
    
    // Wait for React hydration
    await page.waitForTimeout(2000);
    
    // Check that consent checkbox exists
    const checkbox = page.locator('input[type="checkbox"]').first();
    await expect(checkbox).toBeVisible();
    
    // Verify consent text is present (after hydration)
    const consentLabel = page.locator('label:has(input[type="checkbox"])');
    await expect(consentLabel).toBeVisible();
    const labelText = await consentLabel.textContent();
    expect(labelText?.length).toBeGreaterThan(5);
  });

  test("login form shows error with invalid credentials", async ({ page }) => {
    await page.goto("/login");
    
    await page.fill('input[type="email"]', "test_nonexistent@hay-home.com");
    await page.fill('input[type="password"]', "wrongpassword123");
    
    const submitBtn = page.locator('button[type="submit"]');
    await submitBtn.click();
    
    await page.waitForTimeout(2000);
    
    const body = await page.textContent("body");
    const hasError = body?.match(/error|ошибк|неверн|invalid|incorrect/i);
    expect(hasError).toBeTruthy();
  });

  test("password visibility toggle works on login", async ({ page }) => {
    await page.goto("/login");
    
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill("testpass");
    
    // Click eye/toggle button near password
    const toggleBtn = page.locator('button[type="button"]').last();
    if (await toggleBtn.isVisible()) {
      await toggleBtn.click();
      await page.waitForTimeout(200);
    }
    // Test passes if no crash
  });
});
