import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/visual",
  workers: 1,
  snapshotPathTemplate: "{testDir}/baselines/{projectName}/{arg}{ext}",
  expect: {
    toHaveScreenshot: { animations: "disabled", maxDiffPixelRatio: 0.001 },
  },
  use: {
    baseURL: "http://127.0.0.1:3002",
    reducedMotion: "reduce",
    colorScheme: "light",
    locale: "en-US",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 1000 } } },
    { name: "mobile", use: { viewport: { width: 390, height: 844 } } },
  ],
  webServer: {
    command: "python3 -m http.server 3002 --bind 127.0.0.1 --directory dist",
    url: "http://127.0.0.1:3002",
    reuseExistingServer: false,
  },
});
