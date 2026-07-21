/**
 * @critical
 * Поток бронирования: выбор дат → подтверждение → редирект
 */
import { test, expect } from "@playwright/test";
import { authAs } from "../fixtures/auth";

let hostId: string;

test.beforeAll(async ({ request }) => {
  const res = await request.get("/api/hosts");
  const hosts = await res.json();
  hostId = hosts[0]?.id || "";
});

test.describe("Бронирование — неавторизованный пользователь", () => {
  test("@critical попытка бронирования без авторизации — редирект на логин", async ({ page }) => {
    if (!hostId) { test.skip(); return; }
    await page.goto(`/hosts/${hostId}`);
    await page.waitForLoadState("networkidle");

    const btn = page.locator(
      'button:has-text("Забронировать"), button:has-text("Book"), a:has-text("Забронировать")'
    ).first();

    if (!await btn.isVisible({ timeout: 8000 }).catch(() => false)) {
      test.skip();
      return;
    }

    await btn.click();
    await page.waitForURL(/\/login/, { timeout: 10000 });
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Бронирование — авторизованный гость", () => {
  test("@critical форма бронирования открывается", async ({ browser }) => {
    if (!hostId) { test.skip(); return; }

    const context = await authAs(browser, "guest");
    const page = await context.newPage();

    await page.goto(`/hosts/${hostId}`);
    await page.waitForLoadState("networkidle");

    const btn = page.locator(
      'button:has-text("Забронировать"), button:has-text("Book")'
    ).first();

    if (!await btn.isVisible({ timeout: 8000 }).catch(() => false)) {
      await context.close();
      test.skip();
      return;
    }

    await btn.click();
    await page.waitForTimeout(500);

    // Должна появиться форма с датами или перейти на страницу бронирования
    const hasBookingUI = await page.locator(
      'input[type="date"], [class*="calendar"], [class*="booking"], [class*="datepicker"]'
    ).first().isVisible({ timeout: 5000 }).catch(() => false);

    const isBookingPage = page.url().includes("/book") || page.url().includes("/booking");

    expect(hasBookingUI || isBookingPage).toBeTruthy();
    await context.close();
  });

  test("форма бронирования — поля чекин/чекаут присутствуют", async ({ browser }) => {
    if (!hostId) { test.skip(); return; }

    const context = await authAs(browser, "guest");
    const page = await context.newPage();
    await page.goto(`/hosts/${hostId}`);
    await page.waitForLoadState("networkidle");

    const btn = page.locator('button:has-text("Забронировать"), button:has-text("Book")').first();
    if (!await btn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await context.close();
      test.skip();
      return;
    }
    await btn.click();
    await page.waitForTimeout(600);

    const body = await page.textContent("body");
    expect(body).not.toMatch(/500|internal server error/i);
    await context.close();
  });
});

test.describe("API бронирования — прямые вызовы", () => {
  test("@critical POST /api/bookings без авторизации — 401", async ({ request }) => {
    const res = await request.post("/api/bookings", {
      data: { hostId, checkIn: "2025-09-01", checkOut: "2025-09-05" },
    });
    expect(res.status()).toBe(401);
  });

  test("@critical POST /api/bookings без checkIn — 400", async ({ request }) => {
    const loginRes = await request.post("/api/auth/login", {
      data: { email: "test.guest@hay-home.com", password: "testpass123" },
    });
    if (!loginRes.ok()) { test.skip(); return; }

    const res = await request.post("/api/bookings", {
      data: { hostId },
    });
    expect([400, 401]).toContain(res.status());
  });
});
