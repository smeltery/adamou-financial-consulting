import { test, expect } from "@playwright/test";
let script: string;
test.beforeAll(async () => {
  const built = await Bun.build({
    entrypoints: ["src/client/activity.ts"],
    target: "browser",
    minify: true,
  });
  if (!built.success)
    throw new AggregateError(built.logs, "Activity test bundle failed");
  script = await built.outputs[0].text();
});
test("verified activity stacks, can be dismissed, and stays hidden for this visit", async ({
  page,
}) => {
  const now = Date.now();
  await page.route("**/api/activity", (route) =>
    route.fulfill({
      json: {
        events: [0, 1, 2, 3].map((index) => ({
          id: String(index).repeat(64),
          at: now - index * 60000,
        })),
      },
    }),
  );
  await page.goto("/services/");
  await page.clock.install();
  await page.locator("#inquiry-activity").evaluate((element) => {
    (element as HTMLElement).dataset.enabled = "true";
  });
  await page.addScriptTag({ content: script, type: "module" });
  await page.clock.fastForward(8100);
  await expect(page.locator(".activity-toast")).toHaveCount(3);
  await expect(page.locator(".activity-toast").first()).toContainText(
    "Someone sent Matt an inquiry.",
  );
  await page
    .getByRole("button", { name: "Dismiss inquiry notification" })
    .first()
    .click();
  await expect(page.locator(".activity-toast")).toHaveCount(2);
  await page
    .getByRole("button", { name: "Hide activity for this visit" })
    .click();
  await expect(page.locator("#inquiry-activity")).toBeHidden();
  await page.reload();
  await page.locator("#inquiry-activity").evaluate((element) => {
    (element as HTMLElement).dataset.enabled = "true";
  });
  await page.addScriptTag({ content: script, type: "module" });
  await page.clock.fastForward(91000);
  await expect(page.locator(".activity-toast")).toHaveCount(0);
});
test("empty and stale activity never manufactures notifications", async ({
  page,
}) => {
  await page.route("**/api/activity", (route) =>
    route.fulfill({
      json: { events: [{ id: "a".repeat(64), at: Date.now() - 90000000 }] },
    }),
  );
  await page.goto("/");
  await page.clock.install();
  await page.locator("#inquiry-activity").evaluate((element) => {
    (element as HTMLElement).dataset.enabled = "true";
  });
  await page.addScriptTag({ content: script, type: "module" });
  await page.clock.fastForward(8100);
  await expect(page.locator("#inquiry-activity")).toBeHidden();
});
