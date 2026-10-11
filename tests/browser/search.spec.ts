import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("search supports shortcuts, filtering, keyboard links, and focus restoration", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page.getByRole("button", { name: /Search/ });
  await trigger.click();
  const dialog = page.getByRole("dialog");
  const input = dialog.getByLabel("Search pages and tools");
  await expect(input).toBeFocused();
  await input.fill("no such page");
  await expect(dialog.getByRole("status")).toContainText("No matches");
  await input.fill("loan");
  await expect(
    dialog.getByRole("link", { name: "Loan payment", exact: true }),
  ).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await page.keyboard.press("Control+k");
  await expect(dialog).toBeVisible();
  await input.fill("compound");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/tools\/#tool-growth$/);
  await expect(page.locator(".calculator:visible h2")).toHaveText(
    "Compound growth",
  );
  await page.keyboard.press("Meta+k");
  await expect(dialog).toBeVisible();
  await dialog.getByRole("button", { name: "Close search" }).click();
  await expect(dialog).not.toBeVisible();
});
test("new tools support currency, validation, reset, and direct links", async ({
  page,
}) => {
  await page.goto("/tools/#tool-loan");
  const active = page.locator(".calculator:visible");
  const result = active.locator(".tool-result");
  await expect(result).toContainText("$386.66");
  await active.getByLabel("Loan term").fill("0");
  await expect(result).toContainText("Choose a loan term");
  await active.getByRole("button", { name: "Reset example" }).click();
  await page.getByLabel("Country and currency").selectOption("en-GB");
  await expect(result).toContainText("£386.66");
  await page
    .getByRole("button", { name: "Compound growth", exact: true })
    .click();
  await active.getByLabel("Assumed annual growth rate").fill("0");
  await expect(result).toContainText("£34,000.00");
  await active.getByLabel("Time horizon").fill("1.5");
  await expect(result).toContainText("Enter a valid amount");
  await page.getByRole("button", { name: "Inflation", exact: true }).click();
  await expect(result).toContainText("£1,343.92");
  await page.goBack();
  await expect(active.locator("h2")).toHaveText("Compound growth");
});
