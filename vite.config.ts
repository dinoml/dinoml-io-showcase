import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Work at a domain root or a GitHub Pages repository subdirectory.
  base: "./",
  server: { port: 5174, strictPort: true },
  preview: { port: 4174, strictPort: true },
});
