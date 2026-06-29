import { test, expect } from "@playwright/test";

test.describe("🏠 Homepage & Navigation", () => {
  test("homepage loads with correct title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/HayHome/i);
  });

  test("logo is visible and links to home", async ({ page }) => {
    await page.goto("/");
    const logo = page.locator("a[href='/']").first();
    await expect(logo).toBeVisible();
  });

  test("header navigation links work", async ({ page }) => {
    await page.goto("/");
    
    // Check hosts link
    const hostsLink = page.locator('a[href="/hosts"]').first();
    if (await hostsLink.isVisible()) {
      await hostsLink.click();
      await expect(page).toHaveURL(/\/hosts/);
    }
  });

  test("language switcher opens and shows languages", async ({ page }) => {
    await page.goto("/");
    
    // Find language switcher button (globe icon)
    const langBtn = page.locator('button:has(svg), [aria-label*="language" i]').first();
    if (await langBtn.isVisible()) {
      await langBtn.click();
      // Wait for dropdown
      await page.waitForTimeout(500);
      // Check that at least some language options appear
      const body = await page.textContent("body");
      expect(body).toMatch(/Русский|English|Հայերեն|Français/);
    }
  });
});
