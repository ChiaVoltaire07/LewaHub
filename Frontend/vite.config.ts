import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  test: {
    environment: "jsdom",
    // RTL auto-cleanup relies on globals (afterEach) being present
    globals: true,
    // Threads pool is more reliable than forks on Windows
    pool: "threads",
    maxWorkers: 1,
  },
});
