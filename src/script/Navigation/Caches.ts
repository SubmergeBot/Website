import { fetchPage, sitemap } from "../Utils";

export interface WebCache {
  getPage(url: string): Promise<string>;
}

export class LSCache implements WebCache {
  constructor() {
    sitemap().then((urls) => {
      urls.forEach(async (url) => {
        const page = await fetchPage(url);
        if (page) window.localStorage.setItem(url, page);
      });
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
    navigator.serviceWorker.register("/worker.js");
  }

  async getPage(url: string) {
    const response = await fetch(url);
    return await response.text();
  }
}

export class NoCache implements WebCache {
  async getPage(url: string) {
    const page = await fetchPage(url);
    return page!;
  }
}
