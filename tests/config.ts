// Центральный конфиг для всех тестов HayHome
// BASE_URL единый для Playwright и API-вызовов в fixture'ах

// Playwright прокидывает baseURL через process.env.BASE_URL (из playwright.config.ts)
export const BASE_URL = process.env.BASE_URL || process.env.TEST_BASE_URL || "http://localhost:3000";

export const TEST_USERS = {
  guest: {
    email: process.env.TEST_GUEST_EMAIL || "test.guest@hay-home.com",
    password: process.env.TEST_GUEST_PASSWORD || "testpass123",
    name: "Test Guest",
    role: "guest" as const,
  },
  host: {
    email: process.env.TEST_HOST_EMAIL || "test.host@hay-home.com",
    password: process.env.TEST_HOST_PASSWORD || "testpass123",
    name: "Test Host",
    role: "host" as const,
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || "test.admin@hay-home.com",
    password: process.env.TEST_ADMIN_PASSWORD || "testpass123",
    name: "Test Admin",
    role: "admin" as const,
  },
  provider: {
    email: process.env.TEST_PROVIDER_EMAIL || "test.provider@hay-home.com",
    password: process.env.TEST_PROVIDER_PASSWORD || "testpass123",
    name: "Test Provider",
    role: "provider" as const,
  },
  // partner роли нет в БД — используем guest для тестов партнёрского UI
  partner: {
    email: process.env.TEST_GUEST_EMAIL || "test.guest@hay-home.com",
    password: process.env.TEST_GUEST_PASSWORD || "testpass123",
    name: "Test Partner",
    role: "guest" as const,
  },
} as const;

export const COOKIE_NAME = "hayhome_auth";

export const TEST_HOST_ID = process.env.TEST_HOST_ID || "";

export const TIMEOUTS = {
  api: 10_000,
  navigation: 15_000,
  animation: 500,
} as const;
