import { Page, expect } from "@playwright/test";
import { TIMEOUTS } from "../config";

// Ждать пока пропадёт лоадер/спиннер
export async function waitForLoad(page: Page) {
  await page.waitForLoadState("load", { timeout: TIMEOUTS.navigation });
}

// Проверить что страница не показывает 404/500
export async function expectNoError(page: Page) {
  const body = await page.textContent("body");
  expect(body).not.toMatch(/404|500|not found|server error/i);
}

// Сделать скриншот с именем
export async function screenshot(page: Page, name: string) {
  await page.screenshot({ path: `test-results/screenshots/${name}.png`, fullPage: true });
}

// Кликнуть и дождаться навигации
export async function clickAndNavigate(page: Page, selector: string) {
  await Promise.all([
    page.waitForNavigation({ timeout: TIMEOUTS.navigation }),
    page.click(selector),
  ]);
}

// Дождаться тоста/уведомления
export async function waitForToast(page: Page, textPattern?: string | RegExp) {
  const toast = page.locator('[role="alert"], .toast, [class*="toast"], [class*="notification"]').first();
  await expect(toast).toBeVisible({ timeout: 5000 });
  if (textPattern) {
    await expect(toast).toContainText(textPattern);
  }
  return toast;
}

// Убедиться что пользователь авторизован (есть иконка профиля или имя)
export async function expectLoggedIn(page: Page) {
  await page.goto("/dashboard");
  await expect(page).not.toHaveURL(/\/login/);
}

// Убедиться что редиректит на логин
export async function expectRedirectToLogin(page: Page, path: string) {
  await page.goto(path);
  await expect(page).toHaveURL(/\/login/);
}

// Заполнить форму по объекту {selector: value}
export async function fillForm(page: Page, fields: Record<string, string>) {
  for (const [selector, value] of Object.entries(fields)) {
    await page.fill(selector, value);
  }
}

// Проверить min-height tap target (44px)
export async function checkTapTargets(page: Page) {
  const violations = await page.evaluate(() => {
    const interactive = Array.from(
      document.querySelectorAll("a, button, [role='button'], input, select, textarea")
    );
    return interactive
      .filter((el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && (rect.height < 44 || rect.width < 44);
      })
      .map((el) => ({
        tag: el.tagName,
        text: el.textContent?.trim().slice(0, 40),
        height: Math.round((el as HTMLElement).getBoundingClientRect().height),
        width: Math.round((el as HTMLElement).getBoundingClientRect().width),
      }));
  });
  return violations;
}
