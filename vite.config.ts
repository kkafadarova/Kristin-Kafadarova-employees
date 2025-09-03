import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,                 // позволяват test/expect без import
    setupFiles: "./src/setupTests.ts",
    css: true,                     // да не гърми на CSS импорти
    coverage: {
      reporter: ["text", "html"],
    },
  },
});
