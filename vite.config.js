import { defineConfig } from "vite";
import { resolve } from "path";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@database": resolve(__dirname, "./database"),
      "@pages": resolve(__dirname, "./src/client/pages"),
      "@sheet": resolve(__dirname, "./src/client/pages/sheet"),
      "@contexts": resolve(__dirname, "./src/client/contexts"),
      "@ui": resolve(__dirname, "/src/client/ui"),
      "@styles": resolve(__dirname, "/src/client/styles"),
      "@components": resolve(__dirname, "/src/client/components"),
      "@items": resolve(__dirname, "/src/client/components/items/index.jsx")
    }
  }
});
