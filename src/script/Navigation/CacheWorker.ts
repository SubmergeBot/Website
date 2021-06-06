import { sitemap } from "../Utils";

self.addEventListener("install", async () => {
  console.info("[ServiceWorker] Installing...");
  const cache = await caches.open("site");
  const urls = await sitemap();
  await cache.addAll(urls);
  console.info(`[ServiceWorker] Successfully cached ${urls.length} pages!`);
});

self.addEventListener("fetch", async (event: any) => {
  console.debug(`[ServiceWorker] Received request for ${event.request.url}`);
  const cachedPage = await caches.match(event.request);
  if (cachedPage) {
    console.debug("[ServiceWorker] Responded with cached page");
    event.respondWith(cachedPage);
  }
  try {
    const newPage = await fetch(event.request.url);
    const cache = await caches.open("site");
    await cache.put(event.request, newPage);
    console.debug("[ServiceWorker] Fetched and updated cache");
  } catch {
    console.warn("[ServiceWorker] Failed to update cache");
  }
});
