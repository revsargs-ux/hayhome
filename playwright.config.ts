import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : 2,
  reporter: "list",
  use: {
    baseURL: "https://hay-home.com",
    trace: "on-first-retry",
    locale: "ru-RU",
    // Ignore SSL cert issues (self-signed in dev)
    ignoreHTTPSErrors: true,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: [
            "--disable-gpu",
            "--disable-software-rasterizer",
            "--no-sandbox",
          ],
        },
      },
    },
  ],
});
