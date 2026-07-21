/**
 * Level 1: API unit tests — /api/requests
 */
import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { TEST_USERS } from "../config";
import { post, get } from "../helpers/api";
import { SAMPLE_REQUEST } from "../fixtures/host-fixtures";

let guestToken: string;

before(async () => {
  const res = await post("/api/auth/login", {
    email: TEST_USERS.guest.email,
    password: TEST_USERS.guest.password,
  });
  guestToken = res.headers.get("set-cookie")?.match(/hayhome_auth=([^;]+)/)?.[1] || "";
});

describe("GET /api/requests", () => {
  test("200 — публичный список без auth", async () => {
    const res = await get("/api/requests");
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });

  test("200 — фильтр по category", async () => {
    const res = await get("/api/requests?category=homestay");
    assert.equal(res.status, 200);
  });

  test("200 — фильтр по region", async () => {
    const res = await get("/api/requests?region=Ереван");
    assert.equal(res.status, 200);
  });
});

describe("POST /api/requests", () => {
  test("401 — без авторизации", async () => {
    const res = await post("/api/requests", SAMPLE_REQUEST);
    assert.equal(res.status, 401);
  });

  test("201 — с авторизацией", async () => {
    const res = await post(
      "/api/requests",
      { ...SAMPLE_REQUEST, guestEmail: `req.${Date.now()}@hay-home.com` },
      guestToken
    );
    assert.ok(
      [200, 201].includes(res.status),
      `Ожидался 200/201, получен ${res.status}: ${await res.text()}`
    );
  });

  test("400 — отсутствует checkIn", async () => {
    const { checkIn, ...rest } = SAMPLE_REQUEST;
    const res = await post("/api/requests", rest, guestToken);
    assert.equal(res.status, 400);
  });
});
