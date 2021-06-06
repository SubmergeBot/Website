import MCEP from "mini-css-extract-plugin";
import { resolve } from "path";
import { Configuration } from "webpack";

const config: Configuration = {
  mode: "production",
  entry: {
    style: "./src/style/index.scss",
    script: "./src/script/index.ts",
    worker: "./src/script/Worker.ts",
  },
  output: {
    path: resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  plugins: [new MCEP()],
  module: {
    rules: [
      { test: /\.ts$/, use: "ts-loader" },
      { test: /\.scss$/, use: [MCEP.loader, "css-loader", "sass-loader"] },
    ],
  },
};

export default config;
