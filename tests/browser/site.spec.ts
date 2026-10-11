import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const path of ["/", "/brand/", "/contact/", "/privacy/"]) {
  test(`${path} is accessible and fits the viewport`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator("h1")).toHaveCount(1);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    const audit = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(audit.violations).toEqual([]);
  });
}
test("intake validates, reveals business fields, and prepares an unsent draft", async ({
  page,
}) => {
  await page.goto("/contact/?goal=debt");
  await expect(page.getByLabel("Paying down debt")).toBeChecked();
  await page.getByRole("button", { name: "Prepare my introduction" }).click();
  await expect(page.locator("#email-fallback")).toBeHidden();
  await page.getByLabel("Full name").fill("Example Client");
  await page.getByLabel("Email address").fill("example@example.com");
  await page.getByLabel("Preferred way to connect").selectOption("Phone");
  await expect(
    page.getByRole("textbox", { name: "Phone *", exact: true }),
  ).toHaveAttribute("required", "");
  await page.getByLabel("Preferred way to connect").selectOption("Email");
  await page.getByLabel("Who is this for?").selectOption("My small business");
  await expect(page.getByLabel("Business name and type")).toBeVisible();
  await page.getByLabel("Business name and type").fill("Example Studio");
  await page
    .getByLabel("What would you most like to change?")
    .fill("Build a practical budget.");
  await page.getByLabel("I agree").check();
  await page.getByRole("button", { name: "Prepare my introduction" }).click();
  await expect(page.getByRole("status")).toContainText(
    "It has not been sent yet",
  );
  await expect(page.locator("#email-copy")).toHaveValue(/Example Studio/);
  await expect(
    page.getByRole("link", { name: "Open email draft" }),
  ).toHaveAttribute("href", /^mailto:madamou@afin-consulting.com/);
});
