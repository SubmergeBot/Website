import { fetchPage } from "../../Utils";
import { WebCache } from "./index";

export default class NoCache implements WebCache {
  async getPage(url: string) {
    const page = await fetchPage(url);
    if (!page) return "<main><p>Unable to load page.</p></main>";
    return page;
  }
}
