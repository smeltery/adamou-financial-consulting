import { test, expect } from "@playwright/test";
test("first visit celebrates once across navigation and reloads", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveCount(1);
  expect(await page.evaluate(() => localStorage.getItem("afin:welcomed"))).toBe(
    "1",
  );
  await page.goto("/services/");
  await page.waitForTimeout(1000);
  await expect(page.locator("canvas")).toHaveCount(0);
  await page.reload();
  await page.waitForTimeout(1000);
  await expect(page.locator("canvas")).toHaveCount(0);
});
test("welcome respects reduced motion and records the visit", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.waitForTimeout(1000);
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(await page.evaluate(() => localStorage.getItem("afin:welcomed"))).toBe(
    "1",
  );
});
test("unavailable storage skips welcome without breaking the page", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get() {
        throw new DOMException("Blocked", "SecurityError");
      },
    });
  });
  await page.goto("/tools/");
  await page.waitForTimeout(1000);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".calculator:visible .tool-result")).toContainText(
    "$1,100.00",
  );
});
