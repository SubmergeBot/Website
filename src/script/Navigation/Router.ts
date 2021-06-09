import Navigo from "navigo";
import { LSCache, NoCache, SWCache, WebCache } from "./Caches";

let cache: WebCache;

if ("serviceWorker" in navigator) {
  cache = new SWCache();
} else if ("localStorage" in window) {
  cache = new LSCache();
} else {
  cache = new NoCache();
}

const router = new Navigo("/");

router
  .on(/.*/, (match) => {
    const url = `/${match?.url}`;
    console.debug(`[Router] Navigating to ${url}`);

    const main = document.getElementsByTagName("main")[0];
    cache.getPage(url).then((content) => (main.innerHTML = content));
  })
  .resolve();
