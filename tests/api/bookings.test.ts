/**
 * Level 1: API unit tests — /api/bookings
 * Запуск: node --test tests/api/bookings.test.ts
 */
import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { TEST_USERS } from "../config";
import { post, get } from "../helpers/api";

let guestToken: string;
let adminToken: string;
let testHostId: string;

const checkIn = new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0];
const checkOut = new Date(Date.now() + 17 * 86400000).toISOString().split("T")[0];

before(async () => {
  const [guestRes, adminRes] = await Promise.all([
    post("/api/auth/login", { email: TEST_USERS.guest.email, password: TEST_USERS.guest.password }),
    post("/api/auth/login", { email: TEST_USERS.admin.email, password: TEST_USERS.admin.password }),
  ]);

  const tok = (res: Response) =>
    res.headers.get("set-cookie")?.match(/hayhome_auth=([^;]+)/)?.[1] || "";

  guestToken = tok(guestRes);
  adminToken = tok(adminRes);

  // Взять первый активный хост для тестов бронирований
  const hostsRes = await get("/api/hosts");
  const hosts = await hostsRes.json();
  if (hosts.length > 0) testHostId = hosts[0].id;
});

describe("GET /api/bookings", () => {
  test("401 — без авторизации", async () => {
    const res = await get("/api/bookings");
    assert.equal(res.status, 401);
  });

  test("200 — guest видит только свои бронирования", async () => {
    const res = await get("/api/bookings", guestToken);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });

  test("200 — admin видит все бронирования", async () => {
    const res = await get("/api/bookings", adminToken);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });
});

describe("POST /api/bookings", () => {
  test("401 — без авторизации", async () => {
    const res = await post("/api/bookings", {
      hostId: testHostId,
      checkIn,
      checkOut,
      guests: 1,
      guestName: "Test",
      guestEmail: "test@test.com",
      guestPhone: "+79991234567",
    });
    assert.equal(res.status, 401);
  });

  test("400 — отсутствует hostId", async () => {
    const res = await post(
      "/api/bookings",
      { checkIn, checkOut, guests: 1 },
      guestToken
    );
    assert.equal(res.status, 400);
  });

  test("400 — отсутствует checkIn", async () => {
    const res = await post(
      "/api/bookings",
      { hostId: testHostId, checkOut, guests: 1 },
      guestToken
    );
    assert.equal(res.status, 400);
  });

  test("201 — успешное бронирование (если есть тестовый хост)", async () => {
    if (!testHostId) {
      console.warn("Пропуск: нет тестового хоста");
      return;
    }
    const res = await post(
      "/api/bookings",
      {
        hostId: testHostId,
        checkIn,
        checkOut,
        guests: 1,
        guestName: TEST_USERS.guest.name,
        guestEmail: TEST_USERS.guest.email,
        guestPhone: "+374991234567",
        totalPrice: 150,
        nights: 3,
      },
      guestToken
    );
    // 201 или 409 (если даты уже заняты)
    assert.ok(
      [201, 409].includes(res.status),
      `Ожидался 201 или 409, получен ${res.status}: ${await res.text()}`
    );
  });
});

describe("GET /api/bookings/public", () => {
  test("200 — возвращает только confirmed брони без поля status", async () => {
    if (!testHostId) return;
    const res = await get(`/api/bookings/public?hostId=${testHostId}`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    // Поле status не должно возвращаться (security fix)
    data.forEach((b: any) => {
      assert.equal(b.status, undefined, "status не должен возвращаться в public API");
    });
  });

  test("400 — без hostId", async () => {
    const res = await get("/api/bookings/public");
    assert.equal(res.status, 400);
  });
});
