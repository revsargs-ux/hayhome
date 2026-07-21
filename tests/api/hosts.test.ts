/**
 * Level 1: API unit tests — /api/hosts
 * Запуск: node --test tests/api/hosts.test.ts
 */
import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { TEST_USERS } from "../config";
import { post, get, patch } from "../helpers/api";
import { SAMPLE_HOST } from "../fixtures/host-fixtures";

let adminToken: string;
let guestToken: string;
let createdHostId: string;

before(async () => {
  // Логин admin и guest
  const [adminRes, guestRes] = await Promise.all([
    post("/api/auth/login", { email: TEST_USERS.admin.email, password: TEST_USERS.admin.password }),
    post("/api/auth/login", { email: TEST_USERS.guest.email, password: TEST_USERS.guest.password }),
  ]);

  const extractToken = (res: Response) => {
    const c = res.headers.get("set-cookie") || "";
    return c.match(/hayhome_auth=([^;]+)/)?.[1] || "";
  };

  adminToken = extractToken(adminRes);
  guestToken = extractToken(guestRes);
});

describe("GET /api/hosts", () => {
  test("200 — публичный список без авторизации", async () => {
    const res = await get("/api/hosts");
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data), "должен вернуть массив");
  });

  test("возвращает только active хостов (без auth)", async () => {
    const res = await get("/api/hosts");
    const data = await res.json();
    // Все хосты должны быть active
    data.forEach((h: any) => {
      assert.equal(h.status, "active", `хост ${h.id} имеет статус ${h.status}`);
    });
  });

  test("403 — ?all=true без авторизации", async () => {
    const res = await get("/api/hosts?all=true");
    assert.equal(res.status, 403);
  });

  test("403 — ?all=true с guest токеном", async () => {
    const res = await get("/api/hosts?all=true", guestToken);
    assert.equal(res.status, 403);
  });

  test("200 — ?all=true с admin токеном", async () => {
    const res = await get("/api/hosts?all=true", adminToken);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });
});

describe("POST /api/hosts", () => {
  test("201 — создаёт хоста с валидными данными", async () => {
    const payload = {
      ...SAMPLE_HOST,
      email: `autotest.host.${Date.now()}@hay-home.com`,
    };
    const res = await post("/api/hosts", payload);
    assert.equal(res.status, 201, `Ожидался 201, получен ${res.status}: ${await res.text()}`);
    const data = await res.json();
    assert.ok(data.id, "id должен быть в ответе");
    createdHostId = data.id;
  });

  test("400 — отсутствует обязательное поле name", async () => {
    const { name, ...rest } = SAMPLE_HOST;
    const res = await post("/api/hosts", { ...rest, email: `miss.name.${Date.now()}@hay-home.com` });
    assert.equal(res.status, 400);
  });

  test("400 — отсутствует city", async () => {
    const { city, ...rest } = SAMPLE_HOST;
    const res = await post("/api/hosts", { ...rest, email: `miss.city.${Date.now()}@hay-home.com` });
    assert.equal(res.status, 400);
  });

  test("400 — невалидный email", async () => {
    const res = await post("/api/hosts", { ...SAMPLE_HOST, email: "bademail" });
    assert.equal(res.status, 400);
  });

  test("400 — цена < 0", async () => {
    const res = await post("/api/hosts", {
      ...SAMPLE_HOST,
      email: `neg.price.${Date.now()}@hay-home.com`,
      pricePerNight: -10,
    });
    assert.equal(res.status, 400);
  });

  test("400 — цена > 10000", async () => {
    const res = await post("/api/hosts", {
      ...SAMPLE_HOST,
      email: `big.price.${Date.now()}@hay-home.com`,
      pricePerNight: 99999,
    });
    assert.equal(res.status, 400);
  });

  test("400 — stars вне диапазона 1-5", async () => {
    const res = await post("/api/hosts", {
      ...SAMPLE_HOST,
      email: `bad.stars.${Date.now()}@hay-home.com`,
      stars: 6,
    });
    assert.equal(res.status, 400);
  });
});

describe("GET /api/hosts/[id]", () => {
  test("200 — получает хоста по ID без auth", async () => {
    // Берём первый хост из публичного списка
    const listRes = await get("/api/hosts");
    const hosts = await listRes.json();
    if (hosts.length === 0) {
      console.warn("Нет активных хостов для теста GET /api/hosts/[id]");
      return;
    }
    const id = hosts[0].id;
    const res = await get(`/api/hosts/${id}`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.id, id);
    // Без auth не должно быть паспортных данных
    assert.equal(data.passportSeries, undefined);
    assert.equal(data.passportNumber, undefined);
    assert.equal(data.inn, undefined);
    assert.equal(data.bankAccount, undefined);
  });

  test("404 — несуществующий ID", async () => {
    const res = await get("/api/hosts/00000000-0000-0000-0000-000000000000");
    assert.equal(res.status, 404);
  });
});
