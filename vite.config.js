import { defineConfig } from "vite";
import { aliases } from "./aliases";
import { resolve } from "path";
import react from "@vitejs/plugin-react";
import reactRefresh from "eslint-plugin-react-refresh";


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
