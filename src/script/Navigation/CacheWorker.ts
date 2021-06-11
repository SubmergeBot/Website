import { sitemap } from "../Utils";

async function updateCache(request: Request) {
  const cache = await caches.open("site");

  try {
    const newPage = await fetch(request);
    await cache.put(request, newPage.clone());
    return newPage;
  } catch (e) {
    return "<main><p>Unable to load page.</p></main>";
  }
}

self.addEventListener("install", (event: any) => {
  event.waitUntil(async () => {
    const cache = await caches.open("site");
    const urls = await sitemap();
    await cache.addAll(urls);
  });
});

self.addEventListener("fetch", (event: any) => {
  const request: Request = event.request;
  if (request.method !== "GET") return;

  event.respondWith(
    // this is the most embarrassing part of the entire site
    (async () => {
      const cachedPage = await caches.match(request);

      if (cachedPage) {
        event.waitUntil(updateCache(request));
        return cachedPage;
      }

      const newPage = await updateCache(request);
      if (newPage) {
        return newPage;
      }

      return new Response("<main><p>Unable to load page.</p></main>");
    })()
  );
});
