import Navigo from "navigo";
import { CSCache, SWCache, LSCache, NoCache, WebCache } from "./Caches";
import { Logger } from "../Utils";

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
const logger = new Logger("Router", "#39DB18");

router.on("*", (match) => {
  const url = `/${match?.url}`;
  logger.log("log", `Navigating to ${url}`);

  const main = document.getElementsByTagName("main")[0];
  cache.getPage(url).then((content) => {
    main.outerHTML = content;
    window.scrollTo(0, 0);
    router.updatePageLinks();
  });
});
