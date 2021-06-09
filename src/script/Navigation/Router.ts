import Navigo from "navigo";
import { LSCache, NoCache, SWCache, WebCache } from "./Caches";

let cache: WebCache;

if ("serviceWorker" in navigator) {
  console.info("[Router] Using ServiceWorker Cache");
  cache = new SWCache();
} else if ("localStorage" in window) {
  console.info("[Router] Using LocalStorage Cache");
  cache = new LSCache();
} else {
  console.info("[Router] Not Using Cache");
  cache = new NoCache();
}

const router = new Navigo("/");

router.on("*", (match) => {
  const url = `/${match?.url}`;
  console.debug(`[Router] Navigating to ${url}`);

  const main = document.getElementsByTagName("main")[0];
  cache.getPage(url).then((content) => {
    main.innerHTML = content;
    router.updatePageLinks();
  });
});
