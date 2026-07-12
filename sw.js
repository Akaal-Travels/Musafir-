// Musafir — minimal service worker
// Iska kaam sirf app ko "installable" banana hai (PWA requirement).
// Yeh caching/offline ka bada system nahi hai — data hamesha live
// Google Sheet backend se hi aata hai.

const CACHE_NAME = "musafir-shell-v1";
const SHELL_FILES = ["./musafir.html"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES))
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

// Network-first: hamesha live data try karo, sirf tab fallback do jab
// bilkul offline ho (taaki purana/stale UI galti se na dikhe).
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
