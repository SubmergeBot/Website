import Navigo from "navigo";
import { LSCache, NoCache, SWCache, WebCache } from "./Caches";

let cache: WebCache;

if (window.localStorage) {
  cache = new LSCache();
} else if (navigator.serviceWorker) {
  cache = new SWCache();
} else {
  cache = new NoCache();
}

const router = new Navigo("/");

router.on(/.*/, (match) => {
  console.dir(match);
});
