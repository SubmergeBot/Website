import Navigo from "navigo";
import { LSCache, NoCache, SWCache, WebCache } from "./Caches";

let cache: WebCache;

try {
  console.info("[Router] Using ServiceWorker Cache");
  cache = new SWCache();
} catch (e) {
  try {
    console.info("[Router] Using LocalStorage Cache");
    cache = new LSCache();
  } catch (e) {
    console.info("[Router] Not Using Cache");
    cache = new NoCache();
  }
}

const router = new Navigo("/");

router.on("*", (match) => {
  const url = `/${match?.url}`;
  console.debug(`[Router] Navigating to ${url}`);

  const main = document.getElementsByTagName("main")[0];
  cache.getPage(url).then((content) => {
    main.innerHTML = content;
    window.scrollTo(0, 0);
    router.updatePageLinks();
  });
});
