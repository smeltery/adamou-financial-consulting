import { test, expect } from "@playwright/test";

for (const [slug, label, value, expected] of [
  ["savings-rate", "Monthly amount set aside", "900", "20%"],
  ["simple-interest", "Duration in months", "12", "$200.00"],
  ["discount-savings", "Discount percentage", "50", "$60.00"],
  ["cost-per-use", "Expected number of uses", "30", "$10.00"],
  ["monthly-savings", "Months until your goal", "9", "$1,000.00"],
  ["debt-to-income", "Gross monthly income", "4000", "50%"],
  ["hourly-pay", "Paid weeks each year", "48", "$48,000.00"],
  ["recurring-costs", "Years to compare", "2", "$2,520.00"],
]) {
  test(`${slug} updates from changed inputs`, async ({ page }) => {
    await page.goto(`/tools/${slug}/`);
    await page.getByLabel(label).fill(value);
    await expect(page.locator(".tool-result strong")).toHaveText(expected);
    await page.getByLabel(label).fill("0");
    await expect(page.locator(".tool-result")).not.toContainText(
      /NaN|Infinity/,
    );
  });
}

test("approach steps share an alignment and overview links reach each step", async ({
  page,
}) => {
  await page.goto("/approach/");
  const steps = page.locator(".chapter-process");
  await expect(steps).toHaveCount(3);
  const edges = await steps
    .locator(".eyebrow")
    .evaluateAll((labels) =>
      labels.map((label) => label.getBoundingClientRect().left),
    );
  expect(Math.max(...edges) - Math.min(...edges)).toBeLessThan(1);
  for (const id of ["introduction", "conversation", "direction"]) {
    await page.locator(`.process-overview a[href="#${id}"]`).click();
    await expect(page).toHaveURL(new RegExp(`#${id}$`));
  }
});
