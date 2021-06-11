import { sitemap, Logger, fetchPage, minimizeHtml } from "../../Utils";
import { WebCache } from "./index";

// Uses CacheStorage to manage the cache.
export default class CSCache implements WebCache {
  private logger = new Logger("CSCache", "#C42ADB");

  constructor() {
    if (!("caches" in window)) throw new Error("Not supported");

    caches.open("site").then((cache) => {
      sitemap().then((urls) => {
        cache
          .addAll(urls)
          .then(() => {
            this.logger.group(`Downloaded ${urls.length} pages`, "log", urls);
          })
          .catch(() => {
            this.logger.log("warn", "Failed to download URLs");
          });
      });
    });
  }

  // This is the main method to get a page that is used by the site.
  async getPage(url: string) {
    const cachedPage = await caches.match(url);

    if (cachedPage) {
      this.updatePage(url);
      return minimizeHtml(await cachedPage.text());
    } else {
      const newPage = await this.updatePage(url);
      return newPage || "<main><p>Unable to load page.</p></main>";
    }
  }

  // Helper method to update a page in the cache.
  private async updatePage(url: string) {
    const newPage = await fetchPage(url);
    const cache = await caches.open("site");

    if (!newPage) return null;

    await cache.put(new Request(url), new Response(newPage));
    return minimizeHtml(newPage);
  }
}
