import { test, expect } from "@playwright/test";
test("visitors can use calculators without storage or arrival confetti", async ({
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
