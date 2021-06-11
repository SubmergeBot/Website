import Navigo from "navigo";
import { CSCache, SWCache, LSCache, NoCache, WebCache } from "./Caches";

let cache: WebCache;

try {
  cache = new SWCache();
} catch (e) {
  try {
    cache = new CSCache();
  } catch (e) {
    try {
      cache = new LSCache();
    } catch (e) {
      cache = new NoCache();
    }
  }
}

const router = new Navigo("/");

router.on("*", (match) => {
  const url = `/${match?.url}`;
  console.debug(`[Router] Navigating to ${url}`);

  const main = document.getElementsByTagName("main")[0];
  cache.getPage(url).then((content) => {
    main.outerHTML = content;
    window.scrollTo(0, 0);
    router.updatePageLinks();
  });
});
