import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
async function enter(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore with sample data" }).click();
  await page
    .getByRole("button", { name: "Search workspace", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Search workspace" })
    .fill("Calendar");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Calendar", exact: true }),
  ).toBeVisible();
}
test("calendar creates, edits, exports and removes a meeting in all views", async ({
  page,
}) => {
  await enter(page);
  await page.getByRole("button", { name: "New meeting", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Meeting title").fill("Contract review");
  await dialog.getByLabel("Starts", { exact: true }).fill("2026-10-12T14:00");
  await dialog.getByLabel("Ends", { exact: true }).fill("2026-10-12T13:00");
  await dialog.getByRole("button", { name: "Save meeting" }).click();
  await expect(dialog.getByRole("alert")).toContainText("end must be after");
  await dialog.getByLabel("Ends", { exact: true }).fill("2026-10-12T15:00");
  await dialog.getByLabel("Status", { exact: true }).selectOption("confirmed");
  await dialog.getByRole("button", { name: "Save meeting" }).click();
  await expect(dialog).not.toBeVisible();
  for (const name of ["Week", "Day", "Month"]) {
    await page.getByRole("button", { name, exact: true }).click();
    await expect(
      page.getByRole("button", { name, exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
  }
  for (const [mode, days] of [
    ["Week", 7],
    ["Day", 1],
  ] as const) {
    await page.getByRole("button", { name: mode, exact: true }).click();
    await expect(page.locator(".calendar-agenda > section")).toHaveCount(days);
    await expect(page.locator(".calendar-cell")).toHaveCount(
      mode === "Week" ? 7 : 0,
    );
    const reminder = page
      .locator(".calendar-event")
      .filter({ hasText: "Follow-up reminder" })
      .first();
    await expect(reminder).toBeVisible();
    const title = await reminder.locator(".calendar-event-title").boundingBox();
    const row = await reminder.boundingBox();
    expect(title!.width).toBeGreaterThan(120);
    expect(row!.height).toBeLessThan(200);
  }
  const searchBox = await page
    .getByRole("button", { name: "Search workspace", exact: true })
    .boundingBox();
  const avatar = await page.locator(".owner-avatar").boundingBox();
  expect(avatar!.x - searchBox!.x - searchBox!.width).toBeGreaterThanOrEqual(8);
  await page.getByRole("button", { name: "Export all" }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download .ics" }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("afin-calendar.ics");
  const fs = await import("node:fs/promises");
  const text = await fs.readFile((await file.path())!, "utf8");
  expect(text).toContain("Contract review");
  expect(text).toContain("STATUS:CONFIRMED");
  await page
    .getByRole("button", { name: "Search workspace", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Search workspace" })
    .fill("Contract review");
  await page.keyboard.press("Enter");
  await expect(dialog.getByLabel("Meeting title")).toHaveValue(
    "Contract review",
  );
  await dialog.getByLabel("Status", { exact: true }).selectOption("cancelled");
  await dialog.getByRole("button", { name: "Save meeting" }).click();
  await page
    .getByRole("button", { name: "Search workspace", exact: true })
    .click();
  await page
    .getByRole("combobox", { name: "Search workspace" })
    .fill("Contract review");
  await page.keyboard.press("Enter");
  await dialog.getByRole("button", { name: "Remove", exact: true }).click();
  await dialog.getByRole("button", { name: "Confirm removal" }).click();
  await expect(dialog).not.toBeVisible();
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
test("workspace search supports shortcuts, keyboard selection, empty results and scroll lock", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore with sample data" }).click();
  await expect(
    page.getByRole("button", { name: "Search workspace", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Control+k");
  const search = page.getByRole("combobox", { name: "Search workspace" });
  await expect(search).toBeFocused();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await search.fill("nothing-will-match-this");
  await expect(page.getByRole("dialog").getByRole("status")).toContainText(
    "No matches",
  );
  await search.fill("Alex Morgan");
  await page.getByRole("dialog").evaluate(async (element) => {
    await Promise.all(
      element
        .getAnimations({ subtree: true })
        .map((animation) => animation.finished),
    );
  });
  expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowUp");
  await page.keyboard.press("Enter");
  await expect(
    page.getByRole("dialog").getByLabel("Name", { exact: true }),
  ).toHaveValue("Alex Morgan");
  await page.keyboard.press("Escape");
  await page.keyboard.press("Meta+k");
  await expect(search).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(search).not.toBeVisible();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});
