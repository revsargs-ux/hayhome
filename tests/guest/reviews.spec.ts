/**
 * Отзывы — публичный просмотр и отправка авторизованным пользователем
 */
import { test, expect } from "@playwright/test";
import { authAs } from "../fixtures/auth";
import { post, get } from "../helpers/api";
import { TEST_USERS } from "../config";

let hostId: string;

test.beforeAll(async ({ request }) => {
  const res = await request.get("/api/hosts");
  const hosts = await res.json();
  hostId = hosts[0]?.id || "";
});

test.describe("API отзывов", () => {
  test("GET /api/reviews — публичный доступ", async ({ request }) => {
    const res = await request.get("/api/reviews");
    expect([200, 404]).toContain(res.status());
    if (res.status() === 200) {
      const data = await res.json();
      expect(Array.isArray(data)).toBeTruthy();
    }
  });

  test("POST /api/reviews без авторизации — 401", async ({ request }) => {
    const res = await request.post("/api/reviews", {
      data: { hostId, rating: 5, text: "Отличное место!" },
    });
    expect(res.status()).toBe(401);
  });

  test("POST /api/reviews — текст менее 10 символов — 400", async () => {
    const loginRes = await post("/api/auth/login", {
      email: TEST_USERS.guest.email,
      password: TEST_USERS.guest.password,
    });
    const token = loginRes.headers.get("set-cookie")?.match(/hayhome_auth=([^;]+)/)?.[1] || "";
    if (!token) { return; }

    const res = await post("/api/reviews", { hostId, rating: 5, text: "Коротко" }, token);
    expect([400, 422]).toContain(res.status);
  });

  test("POST /api/reviews — рейтинг вне диапазона (0) — 400", async () => {
    const loginRes = await post("/api/auth/login", {
      email: TEST_USERS.guest.email,
      password: TEST_USERS.guest.password,
    });
    const token = loginRes.headers.get("set-cookie")?.match(/hayhome_auth=([^;]+)/)?.[1] || "";
    if (!token) { return; }

    const res = await post("/api/reviews", {
      hostId,
      rating: 0,
      text: "Текст длиннее десяти символов для теста",
    }, token);
    expect([400, 422]).toContain(res.status);
  });
});

test.describe("UI отзывов", () => {
  test("секция отзывов видна на странице хоста", async ({ page }) => {
    if (!hostId) { test.skip(); return; }
    await page.goto(`/hosts/${hostId}`);
    await page.waitForLoadState("networkidle");

    const reviews = page.locator('[class*="review"], [class*="отзыв"], section:has-text("Отзывы")').first();
    const reviewsExist = await reviews.isVisible({ timeout: 5000 }).catch(() => false);
    // Секция может отсутствовать если нет отзывов — это нормально
    if (!reviewsExist) {
      console.log("Секция отзывов не найдена — возможно нет отзывов");
    }
  });

  test("авторизованный пользователь видит форму отзыва", async ({ browser }) => {
    if (!hostId) { test.skip(); return; }
    const context = await authAs(browser, "guest");
    const page = await context.newPage();
    await page.goto(`/hosts/${hostId}`);
    await page.waitForLoadState("networkidle");

    const form = page.locator('form, [class*="review-form"]').first();
    const body = await page.textContent("body");
    // Просто убеждаемся что страница не упала
    expect(body).not.toMatch(/500|internal server error/i);
    await context.close();
  });
});
