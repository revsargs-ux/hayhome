// HayHome Service Worker — shell + static caching (API excluded)
const CACHE_NAME = "hayhome-v2";
const SHELL = ["/", "/manifest.json"];
const API_PREFIX = "/api/";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  // Never cache API requests — always go to network
  if (url.pathname.startsWith(API_PREFIX)) {
    event.respondWith(fetch(event.request).catch(() => new Response('Network error', { status: 503 })));
    return;
  }

  // Cache-first for static assets, network fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((resp) => {
          if (resp.status === 200 && resp.type === "basic") {
            const clone = resp.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return resp;
        })
        .catch(() => cached);
    })
  );
});
