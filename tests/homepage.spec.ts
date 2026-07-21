import { test, expect } from "@playwright/test";

test.describe("🏠 Homepage & Navigation", () => {
  test("homepage loads with correct title", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await expect(page).toHaveTitle(/HayHome/i, { timeout: 10000 });
  });

  test("logo is visible and links to home", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const logo = page.locator("header a[href='/']").first();
    await expect(logo).toBeVisible({ timeout: 10000 });
  });

  test("header navigation links work", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hostsLink = page.locator('header a[href="/hosts"]').first();
    await expect(hostsLink).toBeVisible({ timeout: 10000 });
    await hostsLink.click();
    // Wait for navigation, not networkidle
    await page.waitForTimeout(2000);
    expect(page.url()).toContain("/hosts");
  });

  test("language switcher opens and shows languages", async ({ page }) => {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const langBtn = page.locator("header button[title='Select language']").first();
    await expect(langBtn).toBeVisible({ timeout: 10000 });
    await langBtn.click();
    await page.waitForTimeout(1000);
    const body = await page.textContent("body");
    expect(body).toMatch(/Русский|English|Հայերեն|Français/);
  });
});
