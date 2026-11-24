/* SchoLink Global service worker — network-first, cache fallback. */
const CACHE = "scholink-global-v2";
const ASSETS = [
  "./", "./index.html", "./manifest.webmanifest",
  "./assets/css/app.css", "./assets/css/theme.css",
  "./assets/js/i18n.js", "./assets/js/data.js", "./assets/js/data-id.js",
  "./assets/js/data-unis.js", "./assets/js/data-expanded.js", "./assets/js/data-prep.js",
  "./assets/js/engine.js", "./assets/js/admission-engine.js",
  "./assets/js/ui.js", "./assets/js/pages.js", "./assets/js/app-pages.js", "./assets/js/app.js",
  "./assets/favicon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const sameOrigin = new URL(event.request.url).origin === location.origin;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put("./index.html", copy));
        return res;
      }).catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    fetch(event.request).then((res) => {
      if (res.ok && sameOrigin) {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(event.request, copy));
      }
      return res;
    }).catch(() => caches.match(event.request))
  );
});
