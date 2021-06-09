import { sitemap } from "../Utils";

async function updateCache(request: Request) {
  const cache = await caches.open("site");

  try {
    const newPage = await fetch(request);
    await cache.put(request, newPage.clone());
    console.debug(`[ServiceWorker] Saved ${request.url} to cache`);
    return newPage;
  } catch (e) {
    console.warn(`[ServiceWorker] Unable to update cache (${e})`);
  }
}

self.addEventListener("install", (event: any) => {
  event.waitUntil(async () => {
    console.info("[ServiceWorker] Installing...");

    const cache = await caches.open("site");
    const urls = await sitemap();
    await cache.addAll(urls);

    console.info(`[ServiceWorker] Successfully cached ${urls.length} pages!`);
  });
});

self.addEventListener("fetch", (event: any) => {
  const request: Request = event.request;
  if (request.method !== "GET") return;

  event.respondWith(
    // this is the most embarassing part of the entire site
    (async () => {
      const cachedPage = await caches.match(request);

      if (cachedPage) {
        console.debug(`[ServiceWorker] Sent cached page for ${request.url}`);
        event.waitUntil(updateCache(request));
        return cachedPage;
      }

      const newPage = await updateCache(request);
      if (newPage) {
        console.debug(`[ServiceWorker] Sent fresh page for ${request.url}`);
        return newPage;
      }

      console.error(`[ServiceWorker] Failed to load ${request.url}.`);
      console.error("[ServiceWorker] Page not cached and network unavailable.");
      return new Response("<main><p>Unable to load page.</main>");
    })()
  );
});
