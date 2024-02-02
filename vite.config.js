import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": resolve(__dirname, "./client"),
      "@database": resolve(__dirname, "./database"),
      "@pages": resolve(__dirname, "./pages"),
      "@sheet": resolve(__dirname, "./pages/sheet"),
      "@contexts": resolve(__dirname, "./contexts"),
      "@ui": resolve(__dirname, "./interface/ui"),
      "interface": resolve(__dirname, "./interface/index.js"),
      "utilities": resolve(__dirname, "./utilities/index.js"),
      "@packages": resolve(__dirname, "./components/packages"),
      "@styles": resolve(__dirname, "./interface/styles"),
      "@components": resolve(__dirname, "./components"),
      "@campaigns": resolve(__dirname, "./components/campaigns"),
      "@items": resolve(__dirname, "./components/items/index.jsx"),
      "@options": resolve(__dirname, "./components/packages/options.js"),
      "@character": resolve(__dirname, "./components/packages/character.js"),
      "@rules": resolve(__dirname, './components/packages/rules.js'),
      "@actions": resolve(__dirname, './components/actions'),
      "@user": resolve(__dirname, './components/user')
    }
  }
});
