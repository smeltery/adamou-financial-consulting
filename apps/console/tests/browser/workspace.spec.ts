import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
async function navigate(page: import("@playwright/test").Page, label: string) {
  const toggle = page.getByRole("button", {
    name: "Open navigation",
    exact: true,
  });
  if (await toggle.isVisible()) await toggle.click();
  await page
    .getByRole("navigation")
    .getByRole("button", { name: label, exact: true })
    .click();
}
test("manual onboarding, progress, editing, archive and reopening", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore with sample data" }).click();
  await page.getByRole("button", { name: "Add client", exact: true }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name", { exact: true }).fill("Test Client");
  await dialog.getByLabel("Email", { exact: true }).fill("test@example.com");
  await dialog.getByLabel("Stage", { exact: true }).selectOption("onboarding");
  await expect(
    dialog.getByText("Agree fees and working arrangements"),
  ).toBeVisible();
  await dialog.getByLabel("Add to Client goals").fill("Build a buffer");
  await dialog
    .getByRole("group", { name: "Client goals", exact: true })
    .getByRole("button", { name: "Add", exact: true })
    .click();
  await dialog.getByLabel("Build a buffer", { exact: true }).check();
  await dialog.getByRole("button", { name: "Save client" }).click();
  await expect(dialog).not.toBeVisible();
  await navigate(page, "All clients");
  await page.getByLabel("Search clients").fill("Test Client");
  await page
    .getByRole("button", { name: "Test Client test@example.com" })
    .click();
  await expect(
    dialog.getByLabel("Build a buffer", { exact: true }),
  ).toBeChecked();
  await dialog.getByLabel("Stage", { exact: true }).selectOption("archived");
  await dialog.getByRole("button", { name: "Save client" }).click();
  await expect(
    dialog.getByText("Archiving removes this client", { exact: false }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Confirm archive" }).click();
  await navigate(page, "Archive");
  await page
    .getByRole("button", { name: "Test Client test@example.com" })
    .click();
  await dialog.getByLabel("Stage", { exact: true }).selectOption("active");
  await dialog.getByRole("button", { name: "Save client" }).click();
  await navigate(page, "All clients");
  await page.getByLabel("Search clients").fill("Test Client");
  await expect(page.getByText("Active", { exact: true }).last()).toBeVisible();
});
test("unsaved edits stay recoverable and the workspace is accessible", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Explore with sample data" }).click();
  await expect(
    page.getByRole("heading", { name: "New client records" }),
  ).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
  await page.getByRole("button", { name: "Add client", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Name", { exact: true })
    .fill("Unsaved");
  await page.keyboard.press("Escape");
  await expect(page.getByText("Discard your unsaved changes?")).toBeVisible();
  await page.getByRole("button", { name: "Keep editing" }).click();
  await expect(
    page.getByRole("dialog").getByLabel("Name", { exact: true }),
  ).toHaveValue("Unsaved");
});

test("mobile navigation locks the page and closes with Escape", async ({
  page,
}, info) => {
  test.skip(info.project.name !== "mobile");
  await page.goto("/");
  await page.getByRole("button", { name: "Explore with sample data" }).click();
  await page
    .getByRole("button", { name: "Open navigation", exact: true })
    .click();
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open navigation", exact: true }),
  ).toBeFocused();
  await expect(page.locator("body")).not.toHaveCSS("overflow", "hidden");
});
