import { sitemap, Logger, fetchPage, minimizeHtml } from "../../Utils";
import { WebCache } from "./index";

// Uses LocalStorage to manage the cache. Does not handle page reloads.
export default class LSCache implements WebCache {
  private logger = new Logger("LSCache", "#DBAF2A");

  constructor() {
    if (!("localStorage" in window)) throw new Error("Not supported");

    sitemap().then((urls) => {
      urls.forEach((url) => {
        fetchPage(url).then((page) => {
          if (!page) return;
          window.localStorage.setItem(url, minimizeHtml(page));
        });
      });
      this.logger.group(`Downloaded ${urls.length} pages`, "log", urls);
    });
  }

  async getPage(url: string) {
    const cachedPage = window.localStorage.getItem(url);

    if (cachedPage) {
      fetchPage(url).then((newPage) => {
        if (!newPage) return;
        window.localStorage.setItem(url, minimizeHtml(newPage));
      });
      return cachedPage;
    } else {
      const newPage = await fetchPage(url);
      if (!newPage) return "<main><p>Unable to load page.</p></main>";
      window.localStorage.setItem(url, minimizeHtml(newPage));
      return minimizeHtml(newPage);
    }
  }
}
