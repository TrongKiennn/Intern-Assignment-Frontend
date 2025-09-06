import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      components: path.resolve(__dirname, "components"),
      lib: path.resolve(__dirname, "components/lib"),
      hooks: path.resolve(__dirname, "components/hooks"),
    },
  },
});
