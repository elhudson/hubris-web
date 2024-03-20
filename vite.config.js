import { aliases, jsConfig } from "./scripts/alias.js";
import { makeBackendImports, makeFrontendImports } from "./scripts/imports.js";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";
import { resolve } from "path";

jsConfig(aliases);
await makeFrontendImports(process.env?.NODE_ENV != "production");
await makeBackendImports(process.env?.NODE_ENV != "production");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    reactRefresh,
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  rules: {
    "react-refresh/only-export-components": "warn",
  },
  resolve: {
    alias: Object.fromEntries(
      Object.entries(aliases).map(([alias, path]) => [
        alias,
        resolve(__dirname, path),
      ])
    ),
  },
});
