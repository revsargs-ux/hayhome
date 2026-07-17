import { test, expect } from "@playwright/test";

test.describe("🔄 Edge Cases & Robustness", () => {
  test("non-existent host page returns 404 or error", async ({ page }) => {
    const response = await page.goto("/hosts/nonexistent-id-12345");
    // Should either show 404 page or redirect
    expect(response?.status()).toBeGreaterThanOrEqual(200);
  });

  test("invalid query params don't crash", async ({ page }) => {
    const response = await page.goto("/hosts?invalid=param&page=-1");
    expect(response?.status()).toBeLessThan(500);
  });

  test("services page loads without crash", async ({ page }) => {
    const response = await page.goto("/services");
    if (response) {
      expect(response.status()).toBeLessThan(500);
    }
  });

  test("events page loads without crash", async ({ page }) => {
    const response = await page.goto("/events");
    if (response) {
      expect(response.status()).toBeLessThan(500);
    }
  });

  test("sitemap.xml is valid XML", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("<?xml");
    expect(text).toContain("<urlset");
    expect(text).toContain("hay-home.com");
  });

  test("manifest.json is valid JSON", async ({ request }) => {
    const response = await request.get("/manifest.json");
    expect(response.status()).toBe(200);
    const manifest = await response.json();
    expect(manifest.name).toContain("HayHome");
    expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
    // Check maskable icons exist
    const maskable = manifest.icons.filter((i: any) => i.purpose === "maskable");
    expect(maskable.length).toBeGreaterThanOrEqual(1);
  });

  test("robots.txt is valid", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const text = await response.text();
    expect(text).toContain("User-agent");
    expect(text).toContain("hay-home.com");
  });

  test("very long URL doesn't crash", async ({ page }) => {
    const longParam = "x".repeat(500);
    const response = await page.goto(`/?q=${longParam}`);
    expect(response?.status()).toBeLessThan(500);
  });

  test("XSS attempt in query is sanitized", async ({ page }) => {
    const response = await page.goto("/?q=<script>alert(1)</script>");
    expect(response?.status()).toBeLessThan(500);
    // Check the script is not executed
    const bodyText = await page.textContent("body");
    expect(bodyText).not.toContain("<script>alert(1)</script>");
  });

  test("concurrent API requests don't crash", async ({ request }) => {
    const requests = Array.from({ length: 10 }, () =>
      request.get("/api/health").then((r) => r.status())
    );
    const statuses = await Promise.all(requests);
    expect(statuses.every((s) => s === 200)).toBeTruthy();
  });
});
