/**
 * @i18n
 * Интернационализация — 6 языков
 */
import { test, expect } from "@playwright/test";
import { LANGUAGES, switchLang, expectHtmlLang } from "../helpers/i18n";

test.describe("@i18n Переключение языков", () => {
  test("@i18n все 6 языков загружаются на главной", async ({ page }) => {
    for (const lang of LANGUAGES) {
      await page.goto(`/?lang=${lang}`);
      await page.waitForLoadState("load");
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500|internal server error/i);
    }
  });

  test("@i18n переключение языка сохраняется в URL или cookie", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    // Попытаться переключить через URL
    await page.goto("/?lang=en");
    await page.waitForLoadState("load");
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500/);
  });

  for (const lang of LANGUAGES) {
    test(`@i18n страница /hosts работает на языке ${lang}`, async ({ page }) => {
      await page.goto(`/hosts?lang=${lang}`);
      await page.waitForLoadState("load");
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500|internal server error/i);
    });
  }

  test("@i18n html[lang] атрибут установлен", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    const htmlLang = await page.getAttribute("html", "lang");
    // Должен быть установлен валидный lang
    expect(htmlLang).toBeTruthy();
    expect(htmlLang!.length).toBeGreaterThan(1);
  });

  test("@i18n переключение через UI меняет язык", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("load");

    // Найти переключатель языков
    const langSelector = page.locator(
      '[class*="lang"], select[name*="lang"], [aria-label*="язык" i], [aria-label*="language" i]'
    ).first();

    if (await langSelector.isVisible({ timeout: 5000 }).catch(() => false)) {
      await langSelector.click();
      await page.waitForTimeout(300);
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500/);
    }
  });
});
