import { defineConfig, devices } from "@playwright/test";

const IS_CI = !!process.env.CI;
const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

export default defineConfig({
  testDir: "./tests",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  forbidOnly: IS_CI,
  retries: IS_CI ? 2 : 0,
  workers: IS_CI ? 1 : 4,
  reporter: [["html", { open: "never" }], ["list"]],

  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    locale: "ru-RU",
    timezoneId: "Asia/Yerevan",
    ignoreHTTPSErrors: true,
  },

  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        launchOptions: {
          args: ["--disable-gpu", "--disable-software-rasterizer", "--no-sandbox"],
        },
      },
      testIgnore: ["**/mobile.spec.ts", "**/pwa.spec.ts"],
    },
    {
      name: "mobile-chromium",
      use: {
        ...devices["iPhone 13"],
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 3,
        isMobile: true,
        hasTouch: true,
      },
      testMatch: ["**/mobile.spec.ts", "**/pwa.spec.ts", "**/smoke/**"],
    },
  ],

  // webServer только для локальной разработки — на продакшн-URL запускать npm run dev не нужно
  ...(BASE_URL.includes("localhost") ? {
    webServer: {
      command: "npm run dev",
      url: BASE_URL,
      reuseExistingServer: !IS_CI,
      timeout: 90_000,
    },
  } : {}),
});
