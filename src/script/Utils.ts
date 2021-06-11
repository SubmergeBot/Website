type LogMethod = "debug" | "log" | "info" | "warn" | "error";

export function minimizeHtml(raw: string) {
  const minimized = raw.replace(/[\n\t]/gm, "");
  const main = minimized.match(/<main>.*<\/main>/);
  if (!main) return "<main><p>Unable to load page.</p></main>";
  return main[0];
}

export async function fetchPage(url: string) {
  let response: string;

  if (typeof fetch === "function") {
    try {
      const data = await fetch(url);
      response = await data.text();
    } catch (e) {
      response = "";
    }
  } else {
    const xhr = new XMLHttpRequest();

    xhr.open("GET", url);
    xhr.send();

    response = await new Promise((resolve) => {
      xhr.onload = () => resolve(xhr.responseText);
      xhr.onerror = () => resolve("");
    });
  }

  if (!response) return null;
  return response;
}

export async function sitemap() {
  const data = await fetchPage("/sitemap.txt");
  const sitemapRelative = data?.split("\n").map((url) => url.substring(24));

  sitemapRelative?.push("/style.css");
  sitemapRelative?.push("/script.js");
  sitemapRelative?.push("/worker.js");

  return sitemapRelative || [];
}

export class Logger {
  prefix: string[];

  constructor(process: string, color: string) {
    const styles = [
      `background-color: ${color}`,
      "border-radius: 0.5em",
      "color: white",
      "font-weight: bold",
      "padding: 2px 0.5em",
    ];
    this.prefix = [`%c${process}`, styles.join(";")];
  }

  log(method: LogMethod, content: string): void {
    console[method](...this.prefix, content);
  }

  group(label: string, method: LogMethod, content: string[]): void {
    console.groupCollapsed(...this.prefix, label);
    content.forEach((value) => {
      console[method](value);
    });
    console.groupEnd();
  }
}
