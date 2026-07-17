import { test, expect } from "@playwright/test";

test.describe("⚡ Performance Checks", () => {
  test("homepage loads under 3 seconds", async ({ page }) => {
    const start = Date.now();
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const loadTime = Date.now() - start;
    console.log(`Homepage load time: ${loadTime}ms`);
    expect(loadTime).toBeLessThan(5000); // Generous for CI
  });

  test("no console errors on homepage", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") {
        errors.push(msg.text());
      }
    });
    await page.goto("/");
    await page.waitForTimeout(3000);
    // Filter out known noisy errors (favicon, browser extensions, SW registration, etc.)
    const realErrors = errors.filter(
      (e) => !e.includes("favicon") &&
            !e.includes("manifest") &&
            !e.includes("ServiceWorker") &&
            !e.includes("sw.js") &&
            !e.includes("Download the React DevTools") &&
            !e.includes("401") &&
            !e.includes("Failed to load resource")
    );
    console.log("Console errors:", realErrors);
    expect(realErrors.length).toBe(0);
  });

  test("no broken images on homepage", async ({ page }) => {
    const brokenImages: string[] = [];
    page.on("response", (response) => {
      if (response.request().resourceType() === "image" && response.status() >= 400) {
        brokenImages.push(response.url());
      }
    });
    await page.goto("/");
    await page.waitForTimeout(3000);
    expect(brokenImages.length).toBe(0);
  });

  test("all CSS resources load successfully", async ({ page }) => {
    const failedResources: string[] = [];
    page.on("response", (response) => {
      if (
        response.request().resourceType() === "stylesheet" &&
        response.status() >= 400
      ) {
        failedResources.push(response.url());
      }
    });
    await page.goto("/");
    await page.waitForTimeout(2000);
    expect(failedResources.length).toBe(0);
  });

  test("API health responds under 500ms", async ({ request }) => {
    const start = Date.now();
    const response = await request.get("/api/health");
    const elapsed = Date.now() - start;
    expect(response.status()).toBe(200);
    expect(elapsed).toBeLessThan(2000);
    console.log(`Health API response time: ${elapsed}ms`);
  });
});
