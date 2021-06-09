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

    response = await new Promise((resolve, reject) => {
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
