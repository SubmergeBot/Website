import { minimizeHtml, Logger } from "../../Utils";
import { WebCache } from "./index";

export default class SWCache implements WebCache {
  logger = new Logger("SWCache", "#6C2899");

  constructor() {
    if (!("serviceWorker" in navigator)) throw new Error("Not supported");

    navigator.serviceWorker
      .register("/worker.js")
      .then((reg) => {
        this.logger.group("Successfully registered Service Worker", "debug", [
          `Scope: ${reg.scope}`,
        ]);
      })
      .catch((e) => {
        this.logger.log("error", `Failed to register Service Worker: ${e}`);
      });

    navigator.serviceWorker.addEventListener("message", (event) => {
      const data = event.data;

      if (data.method === "group") {
        this.logger.group(data.label, data.method, data.content);
      } else {
        this.logger.log(data.method, data.content);
      }
    });
  }

  async getPage(url: string) {
    // ServiceWorker handles everything
    const page = await fetch(url);
    const content = await page.text();
    return minimizeHtml(content);
  }
}
