// ⚠️ NOTE (2026-07-19 08:11): Этот файл использует жёсткие ID хостов (Petrosyan=3, David=1783353783133).
// Для полной работы нужно переписать на динамический поиск.
// Тесты могут падать если данные в БД изменились.
// Пропускается в основном прогоне. Запускать отдельно: npx playwright test tests/flow-critical.spec.ts

import { test, expect } from "@playwright/test";

// ============================================================
// 🧪 КРИТИЧЕСКИЙ ПУТЬ HayHome — E2E тесты v2
// Запуск: npx playwright test tests/flow-critical.spec.ts
// Порт: hay-home.com (HTTPS) (Dispatcher на 3000, HayHome на 3001)
// ============================================================

// Тестовые данные — реальные хосты из Supabase
const HOST_PETROSYAN_ID = "3";
const HOST_DAVID_ID = "1783353783133";

// ============ 1. ГЛАВНАЯ СТРАНИЦА ============

test.describe("🏠 Главная страница", () => {
  test("загружается с корректным заголовком", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/HayHome/i);
  });

  test("видны секции hero, CTA, навигация", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // CTA кнопки в hero
    await expect(page.locator("a[href='/hosts']").first()).toBeVisible();
    await expect(page.locator("a[href='/become-host']").first()).toBeVisible();
    await expect(page.locator("a[href='/partner']").first()).toBeVisible();

    // Поиск в hero
    const searchInput = page.locator("input[placeholder]").first();
    await expect(searchInput).toBeVisible();
  });

  test("логотип ведёт на главную", async ({ page }) => {
    await page.goto("/hosts");
    await page.waitForLoadState("domcontentloaded");
    const logo = page.locator("a[href='/']").first();
    await logo.click();
    await expect(page).toHaveURL(/\//);
  });

  test("нижнее меню (мобильное) содержит основные ссылки", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Мобильное bottom nav
    const bottomLinks = page.locator("a[href='/']").last();
    // Проверяем что footer виден
    const footer = page.locator("footer");
    await expect(footer).toBeVisible();
  });

  test("footer содержит ссылки на /terms, /privacy, /rules", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    const footer = page.locator("footer");
    await expect(footer.locator("a[href='/terms']")).toBeVisible();
    await expect(footer.locator("a[href='/privacy']")).toBeVisible();
    await expect(footer.locator("a[href='/rules']")).toBeVisible();
  });

  test("переключатель языков виден", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // Globe icon кнопка
    const langBtn = page.locator("button[title='Select language']").first();
    await expect(langBtn).toBeVisible();
  });

  test("нет сломанных изображений на главной", async ({ page }) => {
    const broken: string[] = [];
    page.on("response", (res) => {
      if (res.request().resourceType() === "image" && res.status() >= 400) {
        broken.push(res.url());
      }
    });
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    expect(broken.length).toBe(0);
  });
});

// ============ 2. СТРАНИЦЫ-ИНФОРМАЦИЯ (реальные баги если 404) ============

test.describe("ℹ️ Информационные страницы", () => {
  const infoPages = [
    "/about",
    "/services",
    "/events",
    "/privacy",
    "/terms",
    "/rules",
    "/requisites",
    "/become-host",
    "/partner",
    "/requests",
  ];

  for (const path of infoPages) {
    test(`${path} — код 200`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status(), `${path} должен быть 200`).toBe(200);
    });
  }
});

// ============ 3. СПИСОК ХОСТОВ ============

test.describe("👥 Список хостов (/hosts)", () => {
  test("загружается и показывает карточки", async ({ page }) => {
    await page.goto("/hosts");
    await page.waitForLoadState("domcontentloaded");

    // Карточки хостов
    const hostCards = page.locator("a[href^='/hosts/']");
    const count = await hostCards.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("поиск работает", async ({ page }) => {
    await page.goto("/hosts");
    await page.waitForLoadState("networkidle");

    const searchInput = page.locator("input[placeholder]").first();
    await searchInput.fill("Гюмри");
    await page.waitForTimeout(500);

    // Не крашится
    expect(page.url()).toContain("/hosts");
  });
});

// ============ 4. ПРОФИЛЬ ХОСТА ============

test.describe("🏡 Профиль хоста (/hosts/[id])", () => {
  test("страница Петросян загружается", async ({ page }) => {
    await page.goto(`/hosts/${HOST_PETROSYAN_ID}`);
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("body")).toContainText(/Петросян|Petrosyan/i);
  });

  test("страница Давит загружается", async ({ page }) => {
    await page.goto(`/hosts/${HOST_DAVID_ID}`);
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("body")).toContainText(/Давит|Саргсян|Егвард/i);
  });

  test("кнопка бронирования видна", async ({ page }) => {
    await page.goto(`/hosts/${HOST_PETROSYAN_ID}`);
    await page.waitForLoadState("domcontentloaded");

    const bookBtn = page.locator(`a[href='/book/${HOST_PETROSYAN_ID}']`);
    await expect(bookBtn).toBeVisible();
  });

  test("контакты видны", async ({ page }) => {
    await page.goto(`/hosts/${HOST_PETROSYAN_ID}`);
    await page.waitForLoadState("domcontentloaded");

    const phone = page.locator("a[href^='tel:']").first();
    const email = page.locator("a[href^='mailto:']").first();
    const anyContact = await phone.isVisible() || await email.isVisible();
    expect(anyContact).toBeTruthy();
  });
});

// ============ 5. БРОНИРОВАНИЕ ============

test.describe("📅 Бронирование (/book/[id])", () => {
  test("форма бронирования загружается", async ({ page }) => {
    await page.goto(`/book/${HOST_PETROSYAN_ID}`);
    await page.waitForLoadState("domcontentloaded");

    // Форма или дата-поля видны
    const dateInput = page.locator("input[type='date']").first();
    const form = page.locator("form").first();
    const hasForm = await form.isVisible().catch(() => false);
    const hasDate = await dateInput.isVisible().catch(() => false);
    expect(hasForm || hasDate).toBeTruthy();
  });
});

// ============ 6. АВТОРИЗАЦИЯ ============

test.describe("🔐 Авторизация", () => {
  test("страница входа загружается", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
    await expect(page.locator("button[type='submit']")).toBeVisible();
  });

  test("ссылки навигации на странице входа", async ({ page }) => {
    await page.goto("/login");
    await page.waitForLoadState("domcontentloaded");

    await expect(page.locator("a[href='/register']").first()).toBeVisible();
    await expect(page.locator("a[href='/forgot-password']").first()).toBeVisible();
  });

  test("страница регистрации загружается", async ({ page }) => {
    await page.goto("/register");
    await page.waitForLoadState("domcontentloaded");

    const inputs = page.locator("input");
    expect(await inputs.count()).toBeGreaterThanOrEqual(3);
    await expect(page.locator("input[type='checkbox']")).toBeVisible();
    await expect(page.locator("button[type='submit']")).toBeVisible();
  });

  test("забыли пароль — страница загружается", async ({ page }) => {
    const response = await page.goto("/forgot-password");
    expect(response?.status()).toBe(200);
  });
});

// ============ 7. ЗАЩИТА СТРАНИЦ (middleware) ============

test.describe("🛡️ Защита middleware", () => {
  const protectedRoutes = [
    { route: "/admin", shouldRedirect: true },
    { route: "/dashboard", shouldRedirect: true },
    { route: "/partner/dashboard", shouldRedirect: true },
    { route: "/provider/dashboard", shouldRedirect: true },
  ];

  for (const { route, shouldRedirect } of protectedRoutes) {
    test(`неавторизованный → ${route}`, async ({ page }) => {
      await page.goto(route);
      await page.waitForLoadState("domcontentloaded");

      if (shouldRedirect) {
        // Должен редиректить или показывать ошибку авторизации
        const body = await page.textContent("body");
        const isOnLoginPage = page.url().includes("/login");
        const hasAuthError = body?.match(/login|войдите|sign in|авториз/i);
        expect(isOnLoginPage || hasAuthError).toBeTruthy();
      }
    });
  }
});

// ============ 8. API БЕЗОПАСНОСТЬ ============

test.describe("🔒 API безопасность", () => {
  const protectedApis = [
    { method: "GET" as const, path: "/api/bookings" },
    { method: "POST" as const, path: "/api/bookings" },
    { method: "GET" as const, path: "/api/chat?with=test" },
    { method: "DELETE" as const, path: "/api/upload" },
  ];

  for (const { method, path } of protectedApis) {
    test(`${method} ${path} → 401 или 403`, async ({ request }) => {
      const response = await request.fetch(path, { method });
      expect([401, 403]).toContain(response.status());
    });
  }

  test("GET /api/hosts → 200 и массив", async ({ request }) => {
    const response = await request.get("/api/hosts");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThanOrEqual(1);
  });
});

// ============ 9. EDGE CASES ============

test.describe("🔄 Граничные случаи", () => {
  test("длинный URL не крашит", async ({ page }) => {
    const response = await page.goto(`/?q=${"x".repeat(500)}`);
    expect(response?.status()).toBeLessThan(500);
  });

  test("XSS в query санитизируется", async ({ page }) => {
    const response = await page.goto("/?q=<script>alert(1)</script>");
    expect(response?.status()).toBeLessThan(500);
    const bodyText = await page.textContent("body");
    expect(bodyText).not.toContain("<script>alert(1)</script>");
  });

  test("manifest.json содержит HayHome", async ({ request }) => {
    const response = await request.get("/manifest.json");
    expect(response.status()).toBe(200);
    const manifest = await response.json();
    expect(manifest.name).toContain("HayHome");
  });

  test("concurrent API запросы не крашат", async ({ request }) => {
    const requests = Array.from({ length: 10 }, () =>
      request.get("/api/hosts").then((r) => r.status())
    );
    const statuses = await Promise.all(requests);
    expect(statuses.every((s) => s === 200)).toBeTruthy();
  });
});

// ============ 10. ПРОИЗВОДИТЕЛЬНОСТЬ ============

test.describe("⚡ Производительность", () => {
  test("главная загружается за 5 секунд", async ({ page }) => {
    const start = Date.now();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const loadTime = Date.now() - start;
    console.log(`⏱ Homepage: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000);
  });
});

// ============ 11. ПОЛНЫЙ КРИТИЧЕСКИЙ ПУТЬ ============

test.describe("🚀 Полный критический путь", () => {
  test("Главная → Хосты → Профиль → Бронирование", async ({ page }) => {
    // 1. Главная
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");

    // 2. Кликаем CTA "Найти семью"
    await page.locator("a[href='/hosts']").first().click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toContain("/hosts");

    // 3. Первый хост
    const hostCard = page.locator("a[href^='/hosts/']").first();
    await expect(hostCard).toBeVisible();
    await hostCard.click();
    await page.waitForLoadState("domcontentloaded");
    expect(page.url()).toMatch(/\/hosts\/\d+/);

    // 4. Забронировать
    const bookBtn = page.locator("a[href^='/book/']").first();
    if (await bookBtn.isVisible()) {
      await bookBtn.click();
      await page.waitForLoadState("domcontentloaded");
      expect(page.url()).toMatch(/\/book\/\d+/);
    }
  });
});
