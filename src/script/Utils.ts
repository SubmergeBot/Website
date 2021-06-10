type LogMethod = "debug" | "log" | "info" | "warn" | "error";

export async function fetchPage(url: string, raw = false) {
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
  if (raw) return response;

  return new DOMParser()
    .parseFromString(response, "text/html")
    .getElementsByTagName("main")[0].innerHTML;
}

export async function sitemap() {
  const data = await fetchPage("/sitemap.txt", true);
  const sitemapRelative = data?.split("\n").map((url) => url.substring(24));
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
    content.forEach((value) => console[method]);
    console.groupEnd();
  }
}
