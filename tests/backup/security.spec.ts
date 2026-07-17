import { test, expect } from "@playwright/test";

test.describe("🛡️ Middleware Protection", () => {
  test("unauthenticated user redirected from /admin", async ({ page }) => {
    const response = await page.goto("/admin");
    // Should redirect to /login
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated user redirected from /dashboard", async ({ page }) => {
    await page.goto("/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated user redirected from /partner/dashboard", async ({ page }) => {
    await page.goto("/partner/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });

  test("unauthenticated user redirected from /provider/dashboard", async ({ page }) => {
    await page.goto("/provider/dashboard");
    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("🔒 API Security", () => {
  test("GET /api/bookings requires auth", async ({ request }) => {
    const response = await request.get("/api/bookings");
    expect(response.status()).toBe(401);
  });

  test("POST /api/bookings requires auth", async ({ request }) => {
    const response = await request.post("/api/bookings", {
      data: { hostId: "test", checkIn: "2026-07-01", checkOut: "2026-07-03", guests: 2, totalPrice: 100 },
    });
    expect(response.status()).toBe(401);
  });

  test("GET /api/chat requires auth", async ({ request }) => {
    const response = await request.get("/api/chat?with=test");
    expect(response.status()).toBe(401);
  });

  test("DELETE /api/upload requires auth", async ({ request }) => {
    const response = await request.delete("/api/upload", {
      data: { url: "https://example.com/test.jpg" },
    });
    expect(response.status()).toBe(401);
  });

  test("DELETE /api/auth/delete-account requires auth", async ({ request }) => {
    const response = await request.delete("/api/auth/delete-account", {
      data: { confirm: "DELETE" },
    });
    expect(response.status()).toBe(401);
  });

  test("GET /api/payments/receipt requires auth", async ({ request }) => {
    const response = await request.get("/api/payments/receipt?payment_id=test");
    expect(response.status()).toBe(401);
  });

  test("GET /api/admin/errors requires admin", async ({ request }) => {
    const response = await request.get("/api/admin/errors");
    // 401 (no token) or 403 (wrong role) — both mean protected
    expect([401, 403]).toContain(response.status());
  });
});

test.describe("🏠 Pages Accessibility", () => {
  test("hosts page loads", async ({ page }) => {
    await page.goto("/hosts");
    // Should not be a 404
    const status = await page.goto("/hosts");
    expect(status?.status()).toBeLessThan(400);
  });

  test("privacy page loads", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("terms page loads", async ({ page }) => {
    await page.goto("/terms");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("rules page loads", async ({ page }) => {
    await page.goto("/rules");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("health endpoint returns healthy", async ({ request }) => {
    const response = await request.get("/api/health");
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe("healthy");
  });
});
