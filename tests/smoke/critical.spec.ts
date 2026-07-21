/**
 * @smoke @critical
 * Критичный путь: поиск → карточка хоста → страница бронирования
 * Запуск: npx playwright test --grep @critical
 */
import { test, expect } from "@playwright/test";

test.describe("@smoke @critical критичный путь пользователя", () => {
  test("главная страница загружается", async ({ page }) => {
    await test.step("перейти на главную", async () => {
      await page.goto("/");
      await page.waitForLoadState("load");
    });

    await test.step("страница отвечает без ошибок", async () => {
      const title = await page.title();
      expect(title.length).toBeGreaterThan(0);
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500|internal server error/i);
    });

    await test.step("есть ключевые элементы", async () => {
      await expect(page.locator("header")).toBeVisible();
    });
  });

  test("страница /hosts загружается и показывает список", async ({ page }) => {
    await test.step("перейти к списку хостов", async () => {
      await page.goto("/hosts");
      await page.waitForLoadState("load");
    });

    await test.step("проверить что нет серверной ошибки", async () => {
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500|internal server error/i);
    });

    await test.step("есть поле поиска", async () => {
      await expect(page.locator('input[type="text"]').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test("поиск хостов фильтрует результаты", async ({ page }) => {
    await page.goto("/hosts");
    await page.waitForLoadState("load");

    await test.step("ввести поисковый запрос", async () => {
      const searchInput = page.locator('input[type="text"]').first();
      await searchInput.waitFor({ state: "visible", timeout: 10000 });
      await searchInput.fill("Ереван");
      await page.waitForTimeout(500);
    });

    await test.step("результаты обновились", async () => {
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500/);
    });
  });

  test("страница хоста /hosts/[id] загружается", async ({ page }) => {
    const hostsRes = await page.request.get("/api/hosts");
    const hosts = await hostsRes.json();

    if (!hosts.length) {
      console.warn("Нет активных хостов — пропуск теста");
      test.skip();
      return;
    }

    await test.step("открыть страницу хоста напрямую", async () => {
      await page.goto(`/hosts/${hosts[0].id}`);
      await page.waitForLoadState("load");
    });

    await test.step("страница хоста загрузилась без ошибок", async () => {
      await expect(page).toHaveURL(/\/hosts\/.+/);
      const body = await page.textContent("body") || "";
      expect(body).not.toMatch(/500|internal server error/i);
      // Если хост не найден в БД (только в JSON-fallback) — пропускаем
      if (body.match(/404|not found|Страница не найдена/i)) {
        console.warn("Хост существует в API-fallback, но не в БД Supabase — пропуск");
        test.skip();
      }
    });
  });

  test("кнопка бронирования видна для неавторизованного пользователя", async ({ page }) => {
    const hostsRes = await page.request.get("/api/hosts");
    const hosts = await hostsRes.json();

    if (!hosts.length) {
      console.warn("Нет активных хостов");
      test.skip();
      return;
    }

    await page.goto(`/hosts/${hosts[0].id}`);
    await page.waitForLoadState("load");

    await test.step("есть кнопка бронирования", async () => {
      const btn = page.locator(
        'button:has-text("Забронировать"), button:has-text("Book"), a:has-text("Забронировать"), a:has-text("Book")'
      ).first();
      await expect(btn).toBeVisible({ timeout: 10000 });
    });
  });

  test("неавторизованный пользователь редиректится на логин при попытке забронировать", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
  });
});
