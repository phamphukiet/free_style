// Renderer root là workbench/, build output đè lên chính nó (dist con)
// để electron-main/window.js load đúng file đã build.
import { defineConfig } from "electron-vite";
import { resolve } from "path";

export default defineConfig({
  main: {
    resolve: {
      alias: {
        "@shared": resolve("shared"),
        "@modules": resolve("modules"),
      },
    },
  },
  preload: {
    resolve: {
      alias: {
        "@shared": resolve("shared"),
      },
    },
  },
  renderer: {
    root: "src/renderer",
    resolve: {
      alias: {
        "@shared": resolve("shared"),
        "@modules": resolve("modules"),
      },
    },
    build: {
      rollupOptions: {
        input: resolve("src/renderer/workbench.html"),
      },
    },
    worker: {
      format: "es", // Monaco worker dùng ESM
    },
  },
});
