// Renderer root là workbench/, build output đè lên chính nó (dist con)
// để electron-main/window.js load đúng file đã build.
import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  root: "workbench",
  base: "./",
  build: {
    outDir: "../dist/workbench",
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, "workbench/workbench.html"),
    },
  },
});
