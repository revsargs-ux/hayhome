/**
 * Level 1: API unit tests — /api/favorites
 */
import { test, describe, before } from "node:test";
import assert from "node:assert/strict";
import { TEST_USERS } from "../config";
import { post, get, del } from "../helpers/api";

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

describe("GET /api/favorites", () => {
  test("401 — без авторизации", async () => {
    const res = await get("/api/favorites");
    assert.equal(res.status, 401);
  });

  test("200 — с авторизацией", async () => {
    const res = await get("/api/favorites", guestToken);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.ok(Array.isArray(data));
  });
});

describe("POST /api/favorites", () => {
  test("401 — без авторизации", async () => {
    const res = await post("/api/favorites", { hostId: testHostId });
    assert.equal(res.status, 401);
  });

  test("200/201 — добавить в избранное", async () => {
    if (!testHostId) return;
    const res = await post("/api/favorites", { hostId: testHostId }, guestToken);
    assert.ok(
      [200, 201, 409].includes(res.status),
      `Ожидался 200/201/409, получен ${res.status}`
    );
  });
});

describe("DELETE /api/favorites", () => {
  test("401 — без авторизации", async () => {
    const res = await del("/api/favorites", { hostId: testHostId });
    assert.equal(res.status, 401);
  });

  test("200 — удалить из избранного", async () => {
    if (!testHostId) return;
    const res = await del("/api/favorites", { hostId: testHostId }, guestToken);
    assert.ok(
      [200, 204, 404].includes(res.status),
      `Ожидался 200/204/404, получен ${res.status}`
    );
  });
});
