import { test as base, devices } from "@playwright/test";

interface MobileFixtures {
  mobilePage: import("@playwright/test").Page;
}

export const test = base.extend<MobileFixtures>({
  mobilePage: async ({ browser }, use) => {
    const context = await browser.newContext({
      ...devices["iPhone 13"],
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      locale: "ru-RU",
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },
});

export { expect } from "@playwright/test";
