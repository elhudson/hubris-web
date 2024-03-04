import { defineConfig } from "vite";
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
        plugins: ["@emotion/babel-plugin"]
      }
    })
  ],
  "rules": {
    "react-refresh/only-export-components": "warn"
  },
  resolve: {
    alias: {
      "@src": resolve(__dirname, "./client"),
      "@pages": resolve(__dirname, "./pages"),
      "@ui": resolve(__dirname, "./interface/ui"),
      interface: resolve(__dirname, "./interface/index.js"),
      utilities: resolve(__dirname, "./utilities/index.js"),
      "@styles": resolve(__dirname, "./interface/styles"),
      "@themes": resolve(__dirname, "./interface/styles/themes"),
      "@components": resolve(__dirname, "./components"),
      // "@campaigns": resolve(__dirname, "./components/campaigns"),
      // "@items": resolve(__dirname, "./components/catalog/items"),
      // "@options": resolve(__dirname, "./components/packages/options.js"),
      // "@character": resolve(__dirname, "./components/packages/character.js"),
      // "@rules": resolve(__dirname, "./components/packages/rules.js"),
      // "@actions": resolve(__dirname, "./components/actions"),
      // "@user": resolve(__dirname, "./components/user")
    }
  }
});
