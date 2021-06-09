const glob = require("glob");
const fs = require("fs");

const BASE_URL = "https://www.submerge.run";
const urls = [];

glob.sync("src/html/**/*.html").forEach((fileName) => {
  fileName = fileName.substring(9);
  fileName = fileName.replace("index.html", "");
  fileName = fileName.replace(".html", "");
  urls.push(`${BASE_URL}/${fileName}`);
});

fs.writeFileSync("dist/sitemap.txt", urls.join("\n"));
