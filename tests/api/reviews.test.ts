/**
 * Level 1: API unit tests — /api/reviews
 */
import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { TEST_USERS } from "../config";
import { post, get } from "../helpers/api";

let guestToken: string;
let testHostId: string;

before(async () => {
  const res = await post("/api/auth/login", {
    email: TEST_USERS.guest.email,
    password: TEST_USERS.guest.password,
  });
  guestToken = res.headers.get("set-cookie")?.match(/hayhome_auth=([^;]+)/)?.[1] || "";

  const hostsRes = await get("/api/hosts");
  const hosts = await hostsRes.json();
  if (hosts.length > 0) testHostId = hosts[0].id;
});

describe("GET /api/reviews", () => {
  test("200 — публичный список без авторизации", async () => {
    const res = await get("/api/reviews");
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });

  test("200 — фильтр по hostId", async () => {
    if (!testHostId) return;
    const res = await get(`/api/reviews?hostId=${testHostId}`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
    data.forEach((r: any) => {
      assert.equal(r.hostId, testHostId);
    });
  });
});

describe("POST /api/reviews", () => {
  test("401 — без авторизации", async () => {
    const res = await post("/api/reviews", {
      hostId: testHostId,
      rating: 5,
      text: "Отличное место!",
    });
    assert.equal(res.status, 401);
  });

  test("400 — текст короче 10 символов", async () => {
    if (!testHostId) return;
    const res = await post(
      "/api/reviews",
      { hostId: testHostId, rating: 5, text: "Хор" },
      guestToken
    );
    assert.equal(res.status, 400);
  });

  test("400 — рейтинг вне 1-5", async () => {
    if (!testHostId) return;
    const res = await post(
      "/api/reviews",
      { hostId: testHostId, rating: 6, text: "Тест отзыв достаточной длины" },
      guestToken
    );
    assert.equal(res.status, 400);
  });

  test("400 — рейтинг 0", async () => {
    if (!testHostId) return;
    const res = await post(
      "/api/reviews",
      { hostId: testHostId, rating: 0, text: "Тест отзыв достаточной длины" },
      guestToken
    );
    assert.equal(res.status, 400);
  });
});
