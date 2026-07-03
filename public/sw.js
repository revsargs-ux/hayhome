// HayHome Service Worker — no page caching, only API passthrough
const CACHE_NAME = "hayhome-v8";
const API_PREFIX = "/api/";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // API requests — passthrough
  if (url.pathname.startsWith(API_PREFIX)) {
    event.respondWith(fetch(event.request).catch(() => new Response("Network error", { status: 503 })));
    return;
  }

  // All other requests — always network, no cache
  event.respondWith(
    fetch(event.request).catch(() => {
      // Offline fallback: try any old cache
      return caches.match(event.request) || new Response("Offline", { status: 503 });
    })
  );
});
