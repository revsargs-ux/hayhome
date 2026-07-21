/**
 * Level 1: API unit tests — /api/auth/*
 * Запуск: node --test tests/api/auth.test.ts
 * Требования: Next.js dev server на localhost:3000
 */
import { test, describe, before, after } from "node:test";
import assert from "node:assert/strict";
import { BASE_URL, TEST_USERS, COOKIE_NAME } from "../config";
import { post, get, registerAndGetToken } from "../helpers/api";

let tmpEmail: string;
let tmpToken: string;

describe("POST /api/auth/register", () => {
  test("создаёт пользователя с ролью guest по умолчанию", async () => {
    tmpEmail = `test.reg.${Date.now()}@hay-home.com`;
    const res = await post("/api/auth/register", {
      name: "Тест Регистрация",
      email: tmpEmail,
      password: "testpass123",
    });
    assert.equal(res.status, 201, `Ожидался 201, получен ${res.status}`);
    const data = await res.json();
    assert.ok(data.id, "id должен быть в ответе");
    assert.equal(data.role, "guest", "роль должна быть guest");
    assert.equal(data.email, tmpEmail);
    // Сохранить токен для cleanup
    const setCookie = res.headers.get("set-cookie") || "";
    const m = setCookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    tmpToken = m?.[1] || "";
  });

  test("блокирует регистрацию с ролью admin", async () => {
    const res = await post("/api/auth/register", {
      name: "Fake Admin",
      email: `fake.admin.${Date.now()}@hay-home.com`,
      password: "testpass123",
      role: "admin",
    });
    const data = await res.json();
    assert.notEqual(data.role, "admin", "admin не должен присваиваться через регистрацию");
  });

  test("разрешает роль host", async () => {
    const res = await post("/api/auth/register", {
      name: "Test Host Reg",
      email: `test.hostreg.${Date.now()}@hay-home.com`,
      password: "testpass123",
      role: "host",
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.role, "host");
  });

  test("разрешает роль provider", async () => {
    const res = await post("/api/auth/register", {
      name: "Test Provider Reg",
      email: `test.provreg.${Date.now()}@hay-home.com`,
      password: "testpass123",
      role: "provider",
    });
    assert.equal(res.status, 201);
    const data = await res.json();
    assert.equal(data.role, "provider");
  });

  test("400 — отсутствует name", async () => {
    const res = await post("/api/auth/register", {
      email: "no.name@hay-home.com",
      password: "testpass123",
    });
    assert.equal(res.status, 400);
  });

  test("400 — пароль короче 6 символов", async () => {
    const res = await post("/api/auth/register", {
      name: "Test",
      email: `short.pw.${Date.now()}@hay-home.com`,
      password: "12345",
    });
    assert.equal(res.status, 400);
  });

  test("400 — невалидный email", async () => {
    const res = await post("/api/auth/register", {
      name: "Test",
      email: "notanemail",
      password: "testpass123",
    });
    assert.equal(res.status, 400);
  });

  test("409 — дубликат email", async () => {
    const res = await post("/api/auth/register", {
      name: "Duplicate",
      email: tmpEmail, // уже зарегистрирован выше
      password: "testpass123",
    });
    assert.equal(res.status, 409);
  });
});

describe("POST /api/auth/login", () => {
  test("успешный вход guest", async () => {
    const creds = TEST_USERS.guest;
    const res = await post("/api/auth/login", {
      email: creds.email,
      password: creds.password,
    });
    assert.equal(res.status, 200, `Login guest failed: ${res.status}`);
    const data = await res.json();
    assert.ok(data.id);
    assert.equal(data.role, "guest");
    assert.ok(
      res.headers.get("set-cookie")?.includes(COOKIE_NAME),
      "должна быть установлена кука hayhome_auth"
    );
  });

  test("успешный вход host", async () => {
    const creds = TEST_USERS.host;
    const res = await post("/api/auth/login", {
      email: creds.email,
      password: creds.password,
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.role, "host");
  });

  test("успешный вход admin", async () => {
    const creds = TEST_USERS.admin;
    const res = await post("/api/auth/login", {
      email: creds.email,
      password: creds.password,
    });
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.role, "admin");
  });

  test("401 — неверный пароль", async () => {
    const res = await post("/api/auth/login", {
      email: TEST_USERS.guest.email,
      password: "wrongpassword999",
    });
    assert.equal(res.status, 401);
  });

  test("401 — несуществующий email", async () => {
    const res = await post("/api/auth/login", {
      email: "nobody.exists.xyz@hay-home.com",
      password: "testpass123",
    });
    assert.equal(res.status, 401);
  });

  test("401 — невалидный email (не email-формат)", async () => {
    const res = await post("/api/auth/login", {
      email: "notanemail",
      password: "testpass123",
    });
    assert.equal(res.status, 401);
  });

  test("401 — пустые поля", async () => {
    const res = await post("/api/auth/login", {});
    assert.equal(res.status, 401);
  });
});

describe("GET /api/auth/me", () => {
  let token: string;

  before(async () => {
    const creds = TEST_USERS.guest;
    const res = await post("/api/auth/login", {
      email: creds.email,
      password: creds.password,
    });
    const setCookie = res.headers.get("set-cookie") || "";
    const m = setCookie.match(new RegExp(`${COOKIE_NAME}=([^;]+)`));
    token = m?.[1] || "";
  });

  test("200 — возвращает профиль с валидным токеном", async () => {
    const res = await get("/api/auth/me", token);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(data.id);
    assert.ok(data.email);
    assert.ok(data.role);
  });

  test("401 — без токена", async () => {
    const res = await get("/api/auth/me");
    assert.equal(res.status, 401);
  });

  test("401 — с невалидным токеном", async () => {
    const res = await get("/api/auth/me", "invalid.token.here");
    assert.equal(res.status, 401);
  });
});
