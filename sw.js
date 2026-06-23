// Service Worker for Mohamed Attia portfolio
// Strategy: precache app shell, stale-while-revalidate for data/CDN,
// cache-first for images and library bundles, offline fallback.

const VERSION = "v7";
const SHELL = `shell-${VERSION}`;
const DATA = `data-${VERSION}`;
const IMG = `img-${VERSION}`;
const LIB = `lib-${VERSION}`;
const FONT = `font-${VERSION}`;

const SHELL_URLS = [
  "/",
  "/index.html",
  "/404.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/assets/css/base.css",
  "/assets/js/main.js",
  "/assets/js/utils.js",
  "/assets/vendor/gsap.js",
  "/assets/vendor/scrolltrigger.js",
  "/assets/vendor/lenis.js",
  "/assets/vendor/marked.js",
  "/assets/fonts/jbmono-latin.woff2",
  "/assets/fonts/jbmono-latin-ext.woff2",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(SHELL).then((c) =>
      Promise.all(SHELL_URLS.map((u) => c.add(u).catch(() => {})))
    )
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => !k.endsWith(VERSION))
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

async function safePut(cache, req, res) {
  if (!res || !res.ok || res.type === "opaque" || res.type === "error") return;
  try { await cache.put(req, res.clone()); } catch {}
}
const sameOrigin = (url) => url.origin === self.location.origin;
const isAPI = (url) => url.host === "api.github.com";
const isLib = (url) => url.host === "esm.sh";
const isFont = (url) => url.host === "fonts.googleapis.com" || url.host === "fonts.gstatic.com";
const isImg = (url) =>
  url.host === "cdn.simpleicons.org" ||
  url.host === "github.com" ||
  url.host === "avatars.githubusercontent.com" ||
  url.host === "opengraph.githubassets.com" ||
  /\.(png|jpg|jpeg|gif|webp|avif|svg)$/i.test(url.pathname);

async function cacheFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    safePut(cache, req, res);
    return res;
  } catch (err) {
    if (hit) return hit;
    throw err;
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const hit = await cache.match(req);
  const network = fetch(req)
    .then((res) => { safePut(cache, req, res); return res; })
    .catch(() => null);
  return hit || (await network) || new Response("offline", { status: 503 });
}

async function networkFirst(req, cacheName) {
  const cache = await caches.open(cacheName);
  try {
    const res = await fetch(req);
    safePut(cache, req, res);
    return res;
  } catch {
    const hit = await cache.match(req);
    if (hit) return hit;
    if (req.mode === "navigate") {
      const offline = await caches.match("/offline.html");
      if (offline) return offline;
    }
    throw new Error("offline");
  }
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (req.mode === "navigate") {
    event.respondWith(networkFirst(req, SHELL));
    return;
  }
  if (isAPI(url)) { event.respondWith(staleWhileRevalidate(req, DATA)); return; }
  if (isLib(url)) { event.respondWith(cacheFirst(req, LIB)); return; }
  if (isFont(url)) { event.respondWith(cacheFirst(req, FONT)); return; }
  if (isImg(url)) { event.respondWith(cacheFirst(req, IMG)); return; }
  if (sameOrigin(url)) {
    if (url.pathname.endsWith(".json")) {
      event.respondWith(staleWhileRevalidate(req, DATA));
    } else {
      event.respondWith(staleWhileRevalidate(req, SHELL));
    }
  }
});

self.addEventListener("message", (e) => {
  if (e.data === "skipWaiting") self.skipWaiting();
});
