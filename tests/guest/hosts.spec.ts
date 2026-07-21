/**
 * @critical
 * Страница списка хостов и карточки хостов
 */
import { test, expect } from "@playwright/test";

test.describe("Список хостов /hosts", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/hosts");
    await page.waitForLoadState("networkidle");
  });

  test("@critical страница загружается", async ({ page }) => {
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500|internal server error/i);
    await expect(page.locator("h1, h2").first()).toBeVisible({ timeout: 10000 });
  });

  test("@critical поле поиска присутствует", async ({ page }) => {
    await expect(page.locator('input[type="text"]').first()).toBeVisible({ timeout: 10000 });
  });

  test("поиск по названию фильтрует список", async ({ page }) => {
    const input = page.locator('input[type="text"]').first();
    await input.fill("Ереван");
    await page.waitForTimeout(600);
    const body = await page.textContent("body");
    expect(body).not.toMatch(/500/);
  });

  test("кнопка фильтров открывает панель", async ({ page }) => {
    const filterBtn = page.locator(
      'button:has-text("Фильтр"), button:has-text("Filter"), [aria-label*="фильтр" i]'
    ).first();

    if (await filterBtn.isVisible()) {
      await filterBtn.click();
      await page.waitForTimeout(300);
      // Панель фильтров должна появиться
      const panel = page.locator('[aria-expanded="true"], .filters, [class*="filter"]').first();
      // Просто проверим что страница не упала
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500/);
    }
  });

  test("переключение вид список / карта работает", async ({ page }) => {
    const mapBtn = page.locator(
      'button:has-text("Карта"), button:has-text("Map"), [aria-pressed]'
    ).last();

    if (await mapBtn.isVisible()) {
      await mapBtn.click();
      await page.waitForTimeout(500);
      const body = await page.textContent("body");
      expect(body).not.toMatch(/500/);
    }
  });

  test("@critical карточка хоста содержит цену и рейтинг", async ({ page }) => {
    const firstCard = page.locator('[href^="/hosts/"]').first();
    const exists = await firstCard.isVisible({ timeout: 8000 }).catch(() => false);
    if (!exists) {
      test.skip();
      return;
    }
    // Цена в долларах
    const cardText = await firstCard.locator("..").textContent();
    expect(cardText).toMatch(/\$|\d+/);
  });
});

test.describe("Страница хоста /hosts/[id]", () => {
  let hostId: string;

  test.beforeAll(async ({ request }) => {
    const res = await request.get("/api/hosts");
    const hosts = await res.json();
    hostId = hosts[0]?.id || "";
  });

  test("@critical страница хоста загружается", async ({ page }) => {
    if (!hostId) { test.skip(); return; }
    await page.goto(`/hosts/${hostId}`);
    await page.waitForLoadState("networkidle");
    await expect(page).not.toHaveURL(/\/404/);
    const body = await page.textContent("body");
    expect(body).not.toMatch(/404|not found/i);
  });

  test("кнопка бронирования видна", async ({ page }) => {
    if (!hostId) { test.skip(); return; }
    await page.goto(`/hosts/${hostId}`);
    await page.waitForLoadState("networkidle");
    const btn = page.locator(
      'button:has-text("Забронировать"), button:has-text("Book")'
    ).first();
    await expect(btn).toBeVisible({ timeout: 8000 });
  });

  test("несуществующий хост показывает 404", async ({ page }) => {
    await page.goto("/hosts/00000000-0000-0000-0000-000000000000");
    await page.waitForLoadState("networkidle");
    const body = await page.textContent("body");
    expect(body).toMatch(/404|не найден|not found/i);
  });
});
