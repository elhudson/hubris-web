import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@src": resolve(__dirname, "./src/client"),
      "@database": resolve(__dirname, "./database"),
      "@pages": resolve(__dirname, "./src/client/pages"),
      "@sheet": resolve(__dirname, "./src/client/pages/sheet"),
      "@contexts": resolve(__dirname, "./src/client/contexts"),
      "@ui": resolve(__dirname, "./ui/ui"),
      "interface": resolve(__dirname, "./ui/index.js"),
      "@styles": resolve(__dirname, "/src/client/styles"),
      "@components": resolve(__dirname, "/src/client/components"),
      "@items": resolve(__dirname, "/src/client/components/items/index.jsx"),
      "@options": resolve(__dirname, "./src/client/components/options/index.js")
    }
  }
});
