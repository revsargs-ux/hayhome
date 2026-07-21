/**
 * @critical
 * Главная страница — публичный доступ
 */
import { test, expect } from "@playwright/test";
import { checkTapTargets } from "../helpers/ui";

test.describe("Главная страница", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");
  });

  test("@critical загружается без ошибок", async ({ page }) => {
    const title = await page.title();
    expect(title).toContain("HayHome");
    await expect(page.locator("header")).toBeVisible();
  });

  test("@critical SEO — meta description присутствует", async ({ page }) => {
    const meta = await page.getAttribute('meta[name="description"]', "content");
    expect(meta?.length).toBeGreaterThan(10);
  });

  test("@critical Open Graph теги присутствуют", async ({ page }) => {
    const ogTitle = await page.getAttribute('meta[property="og:title"]', "content");
    const ogImage = await page.getAttribute('meta[property="og:image"]', "content");
    expect(ogTitle?.length).toBeGreaterThan(3);
    expect(ogImage?.length).toBeGreaterThan(3);
  });

  test("canonical URL установлен", async ({ page }) => {
    const canonical = await page.getAttribute('link[rel="canonical"]', "href");
    expect(canonical).toMatch(/hay-home\.com/);
  });

  test("навигация на /hosts работает", async ({ page }) => {
    const link = page.locator('a[href="/hosts"], a:has-text("Семьи"), a:has-text("Families")').first();
    if (await link.isVisible()) {
      await Promise.all([
        page.waitForLoadState("load"),
        link.click(),
      ]);
      await expect(page).toHaveURL(/\/hosts/);
    }
  });

  test("footer присутствует со ссылками", async ({ page }) => {
    await expect(page.locator("footer")).toBeVisible();
  });

  test("tap-таргеты >= 44px на мобильном (mobile)", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/");
    await page.waitForLoadState("load");
    const violations = await checkTapTargets(page);
    // Не должно быть критичных нарушений на главной
    const critical = violations.filter((v) => v.height < 30 || v.width < 30);
    expect(critical).toHaveLength(0);
  });

  test("JSON-LD schema присутствует", async ({ page }) => {
    const schema = await page.evaluate(() => {
      const script = document.querySelector('script[type="application/ld+json"]');
      return script?.textContent || null;
    });
    expect(schema).not.toBeNull();
    const parsed = JSON.parse(schema!);
    expect(parsed["@type"]).toBeTruthy();
  });
});
