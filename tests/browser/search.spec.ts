import { test, expect, type Page } from "@playwright/test";
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
  await expect(dialog.locator(".search-empty")).toContainText("No matches");
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
  await expect(page).toHaveURL(/tools\/compound-growth\/$/);
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
  await chooseTool(page, "Compound growth");
  await active.getByLabel("Assumed annual growth rate").fill("0");
  await expect(result).toContainText("£34,000.00");
  await active.getByLabel("Time horizon").fill("1.5");
  await expect(result).toContainText("Enter a valid amount");
  await chooseTool(page, "Inflation");
  await expect(result).toContainText("£1,343.92");
  await page.goBack();
  await expect(active.locator("h2")).toHaveText("Compound growth");
});

async function chooseTool(page: Page, name: string) {
  await page.locator(".tool-picker button").click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name, exact: true })
    .click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
}

test("overlays lock background scroll and restore the page position", async ({
  page,
}) => {
  await page.goto("/tools/");
  await page.evaluate(() => window.scrollTo({ top: 500, behavior: "instant" }));
  await page.keyboard.press("Control+k");
  const lockedTop = await page
    .locator("body")
    .evaluate((el) => el.getBoundingClientRect().top);
  await page.mouse.move(5, 700);
  await page.mouse.wheel(0, 600);
  expect(
    await page.locator("body").evaluate((el) => el.getBoundingClientRect().top),
  ).toBe(lockedTop);
  await expect(page.locator("html")).toHaveClass(/overlay-open/);
  await page.keyboard.press("Escape");
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(500);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByLabel("Open navigation menu").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByLabel("Open navigation menu")).toBeFocused();
  await expect(page.locator("html")).not.toHaveClass(/overlay-open/);
});
test("tool library scopes results and preserves inputs when switching", async ({
  page,
}) => {
  await page.goto("/tools/");
  await page
    .locator("#tool-budget")
    .getByLabel("Monthly take-home income")
    .fill("6000");
  await page.locator(".tool-picker button").click();
  const dialog = page.getByRole("dialog");
  await expect(
    dialog.getByRole("button", { name: "Tools", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    dialog.getByRole("link", { name: "Home", exact: true }),
  ).toBeHidden();
  await dialog.getByLabel("Search pages and tools").fill("loan");
  await dialog.getByRole("link", { name: "Loan payment", exact: true }).click();
  await expect(page.locator("#selected-tool")).toHaveText("Loan payment");
  await chooseTool(page, "Monthly budget");
  await expect(
    page.locator("#tool-budget").getByLabel("Monthly take-home income"),
  ).toHaveValue("6000");
});

test("search skips motion when reduced motion is preferred", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/tools/");
  await page.keyboard.press("Control+k");
  const dialog = page.locator("#site-search");
  await expect(dialog).toBeVisible();
  await dialog.locator("input").fill("savings");
  expect(
    await dialog.evaluate(
      (element) => element.getAnimations({ subtree: true }).length,
    ),
  ).toBe(0);
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("html")).not.toHaveClass(/overlay-open/);
});
