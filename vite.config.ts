import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./lib/main.ts",
      name: "MML Script",
      fileName: "mml-script",
    },
  },
});
