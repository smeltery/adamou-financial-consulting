import { test, expect } from "@playwright/test";
test("responsive headings preserve word boundaries when line breaks disappear", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.locator(".services h3")).toHaveText([
    "Know where your money is going.",
    "Give your debt a game plan.",
    "Turn “someday” into next steps.",
  ]);
  const rendered = await page.locator(".services h3").allInnerTexts();
  expect(rendered[0]).toBe("Know where your money is going.");
  await page.goto("/contact/");
  expect(await page.locator(".intake-layout aside h2").innerText()).toBe(
    "It starts with a conversation.",
  );
});
test("page links and browser back work with reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page
    .locator(".hero")
    .getByRole("link", { name: "Find your next step" })
    .click();
  await expect(page).toHaveURL(/\/contact\/$/);
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await page.goBack();
  await expect(page.locator(".hero h1")).toBeVisible();
});
