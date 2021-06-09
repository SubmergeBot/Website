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

router.on(/.*/, (match) => {
  if (!match?.url) return;

  console.debug(`[Router] Loading ${match.url}`);

  const main = document.getElementsByTagName("main")[0];
  cache.getPage(match.url).then((content) => {
    console.debug(`[Router] ${main.innerHTML.length} -> ${content.length}`);
    main.innerHTML = content;
  });
});
