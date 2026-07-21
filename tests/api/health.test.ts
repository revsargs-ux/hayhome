/**
 * Level 1: API unit tests — /api/health + быстрые smoke-проверки
 */
import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { get } from "../helpers/api";

describe("GET /api/health", () => {
  test("200 — сервер отвечает", async () => {
    const res = await get("/api/health");
    assert.equal(res.status, 200);
  });

  test("ответ содержит статус ok", async () => {
    const res = await get("/api/health");
    const data = await res.json();
    assert.ok(
      data.status === "ok" || data.ok === true || data.healthy === true,
      `Неожиданный ответ health: ${JSON.stringify(data)}`
    );
  });
});

describe("Публичные эндпоинты доступны", () => {
  const publicEndpoints = [
    "/api/hosts",
    "/api/reviews",
    "/api/requests",
    "/api/services",
    "/api/ratings",
  ];

  for (const path of publicEndpoints) {
    test(`GET ${path} — 200`, async () => {
      const res = await get(path);
      assert.equal(res.status, 200, `${path} вернул ${res.status}`);
    });
  }
});

describe("Защищённые эндпоинты требуют авторизации", () => {
  const protectedEndpoints = [
    "/api/bookings",
    "/api/favorites",
    "/api/auth/me",
    "/api/chat",
  ];

  for (const path of protectedEndpoints) {
    test(`GET ${path} без auth — 401`, async () => {
      const res = await get(path);
      assert.equal(res.status, 401, `${path} должен вернуть 401, вернул ${res.status}`);
    });
  }
});
