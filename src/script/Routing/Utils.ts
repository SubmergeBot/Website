export async function fetchPage(url: string): Promise<string | null> {
  const xhr = new XMLHttpRequest();
  const parser = new DOMParser();

  xhr.open("GET", `https://www.submerge.run/${url}`);
  xhr.send();

  const response: string = await new Promise((resolve, reject) => {
    xhr.onload = () => resolve(xhr.responseText);
    xhr.onerror = () => resolve("");
  });

  if (!response) return null;

  return parser
    .parseFromString(response, "text/html")
    .getElementsByTagName("main")[0].innerHTML;
}

export async function sitemap(): Promise<string[]> {
  const sitemapRaw = await fetchPage("/sitemap.txt");
  return sitemapRaw?.split("\n") || [];
}
