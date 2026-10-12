import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser",
  use: { baseURL: "http://127.0.0.1:3001" },
  projects: [
    {
      name: "desktop",
      testIgnore: "development.spec.ts",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile",
      testIgnore: "development.spec.ts",
      use: { viewport: { width: 390, height: 844 } },
    },
    {
      name: "development",
      testMatch: "development.spec.ts",
      dependencies: ["desktop", "mobile"],
      use: { baseURL: "http://127.0.0.1:3003" },
    },
  ],
  webServer: [
    {
      command: "PORT=3001 bun scripts/serve.ts",
      url: "http://127.0.0.1:3001",
      reuseExistingServer: false,
    },
    {
      command: "bunx astro dev --port 3003 --ignore-lock",
      url: "http://127.0.0.1:3003",
      reuseExistingServer: false,
    },
  ],
});
