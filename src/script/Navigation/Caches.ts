import { fetchPage, sitemap } from "../Utils";

export interface WebCache {
  getPage(url: string): Promise<string>;
}

export class LSCache implements WebCache {
  constructor() {
    if (!("localStorage" in window)) {
      throw new Error("Local Storage not supported")
    }

    sitemap().then((urls) => {
      urls.forEach(async (url) => {
        const page = await fetchPage(url);
        if (page) window.localStorage.setItem(url, page);
      });
      console.info(`[LSCache] Successfully cached ${urls.length} pages!`);
    });
  }

  async getPage(url: string) {
    const cachedPage = window.localStorage.getItem(url);
    const newPage = await fetchPage(url);

    if (newPage) window.localStorage.setItem(url, newPage);

    return newPage || cachedPage || "Failed to load page.";
  }
}

export class SWCache implements WebCache {
  constructor() {
    if (!("serviceWorker" in navigator)) {
      throw new Error("Service Workers not supported");
    }

    navigator.serviceWorker
      .register("/worker.js")
      .then((v) => {
        console.info("[SWCache] Successfully registered service worker");
        console.info(`[SWCache] Scope: ${v.scope}`);
      })
      .catch((r) => {
        console.error(`[SWCache] Failed to register service worker (${r})`);
      });
  }

  async getPage(url: string) {
    const response = await fetch(url);
    const rawHtml = await response.text();
    return new DOMParser()
      .parseFromString(rawHtml, "text/html")
      .getElementsByTagName("main")[0].innerHTML;
  }
}

export class NoCache implements WebCache {
  async getPage(url: string) {
    const page = await fetchPage(url);
    if (page) return page;
    return "<p>Unable to load page.</p>";
  }
}
