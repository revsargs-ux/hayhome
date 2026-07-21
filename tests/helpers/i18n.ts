import { Page } from "@playwright/test";

export const LANGUAGES = ["ru", "en", "hy", "fr", "de", "es"] as const;
export type LangCode = (typeof LANGUAGES)[number];

// Переключить язык через URL-параметр
export async function switchLang(page: Page, lang: LangCode) {
  const url = new URL(page.url());
  url.searchParams.set("lang", lang);
  await page.goto(url.toString());
  await page.waitForLoadState("load");
}

// Переключить язык через UI (если есть селектор)
export async function switchLangViaUI(page: Page, lang: LangCode) {
  const selector = `[data-lang="${lang}"], button:has-text("${lang.toUpperCase()}")`;
  const btn = page.locator(selector).first();
  if (await btn.isVisible()) {
    await btn.click();
    await page.waitForTimeout(300);
  } else {
    // Fallback через URL
    await switchLang(page, lang);
  }
}

// Проверить что html[lang] соответствует языку
export async function expectHtmlLang(page: Page, lang: LangCode) {
  const htmlLang = await page.getAttribute("html", "lang");
  return htmlLang?.startsWith(lang) ?? false;
}

// Проверить RTL для арабского/персидского
export async function expectRtl(page: Page) {
  const dir = await page.getAttribute("html", "dir");
  return dir === "rtl";
}

// Сводная проверка всех 6 языков на странице
export async function checkAllLanguages(
  page: Page,
  path: string,
  check: (page: Page, lang: LangCode) => Promise<void>
) {
  for (const lang of LANGUAGES) {
    await page.goto(`${path}?lang=${lang}`);
    await page.waitForLoadState("load");
    await check(page, lang);
  }
}
