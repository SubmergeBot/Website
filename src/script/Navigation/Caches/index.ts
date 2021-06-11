import CSCache from "./CSCache";
import SWCache from "./SWCache";
import LSCache from "./LSCache";
import NoCache from "./NoCache";

export { SWCache, CSCache, LSCache, NoCache };

export interface WebCache {
  getPage(url: string): Promise<string>;
}
