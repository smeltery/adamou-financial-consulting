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

test("mobile navigation opens and closes after choosing a section", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByLabel("Open navigation menu").click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Services", exact: true })
    .click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeHidden();
  await expect(page).toHaveURL(/#services$/);
});

test("navigation pins only after its height without moving page content", async ({
  page,
}) => {
  await page.goto("/");
  const header = page.locator(".site-header");
  const height = await header.evaluate(
    (element) => element.getBoundingClientRect().height,
  );
  const mainTop = await page
    .locator("main")
    .evaluate((element) => element.getBoundingClientRect().top + scrollY);
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    height - 1,
  );
  await expect(header).not.toHaveClass(/is-pinned/);
  await page.evaluate(
    (y) => window.scrollTo({ top: y, behavior: "instant" }),
    height + 1,
  );
  await expect(header).toHaveClass(/is-pinned/);
  await expect(header).toHaveCSS("position", "fixed");
  expect(
    await page
      .locator("main")
      .evaluate((element) => element.getBoundingClientRect().top + scrollY),
  ).toBe(mainTop);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect(header).not.toHaveClass(/is-pinned/);
});
