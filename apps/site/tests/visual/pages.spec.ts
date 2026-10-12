import { test, expect } from "@playwright/test";

for (const [name, path, selector] of [
  ["home", "/", ".hero"],
  ["services", "/services/", "main"],
  ["library", "/tools/", ".tool-library"],
  ["guide", "/tools/debt-payoff/", ".preparation"],
  ["approach", "/approach/", ".chapter-process"],
  ["related", "/tools/debt-payoff/", ".related-tools"],
  ["calculator", "/tools/debt-payoff/", ".tool-workspace"],
  ["contact", "/contact/", ".intake-layout"],
]) {
  test(`${name} layout`, async ({ page }) => {
    await page.goto(path);
    await expect(
      page.getByRole("button", { name: "Search", exact: true }),
    ).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    if (name === "calculator")
      await expect(page.locator(".calculator input").first()).toBeEnabled();
    await page.addStyleTag({
      content: ".site-header { visibility: hidden !important; }",
    });
    const section = page.locator(selector).first();
    // Align the section before capture; the sticky header is tested separately.
    await section.evaluate((element) =>
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY,
        behavior: "instant",
      }),
    );
    await expect(section).toHaveScreenshot(`${name}.png`);
  });
}

test("search and mobile navigation", async ({ page }, testInfo) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.getByLabel("Search pages and tools").fill("debt");
  await expect(page.locator("#site-search")).toHaveScreenshot("search.png");
  await page.keyboard.press("Escape");
  if (testInfo.project.name === "mobile") {
    await page.getByLabel("Open navigation menu").click();
    await expect(page.locator("#mobile-navigation")).toHaveScreenshot(
      "navigation.png",
    );
  }
});
