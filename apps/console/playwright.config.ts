import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  use: { baseURL: "http://127.0.0.1:3101" },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
  ],
  webServer: [
    {
      command: "bunx vite --host 127.0.0.1 --port 3101 --strictPort",
      url: "http://127.0.0.1:3101",
      reuseExistingServer: false,
    },
    {
      command: "bunx vite preview --host 127.0.0.1 --port 3102 --strictPort",
      url: "http://127.0.0.1:3102",
      reuseExistingServer: false,
    },
  ],
});
