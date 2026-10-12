import { test, expect, type Page } from "@playwright/test";

let configuredApp: string;
test.beforeAll(async () => {
  const build = await Bun.build({
    entrypoints: ["src/client/app.ts"],
    target: "browser",
    minify: true,
    define: {
      FORMSPREE_ENDPOINT: JSON.stringify("https://formspree.io/f/testonly"),
    },
  });
  if (!build.success)
    throw new AggregateError(build.logs, "Test app build failed");
  configuredApp = await build.outputs[0].text();
});
async function completeForm(page: Page, status: number) {
  await page.addInitScript(() => localStorage.setItem("afin:welcomed", "1"));
  await page.route("**/_astro/SiteLayout.*.js", (route) =>
    route.fulfill({ contentType: "text/javascript", body: configuredApp }),
  );
  await page.route("https://formspree.io/f/testonly", (route) =>
    route.fulfill({ status, contentType: "application/json", body: "{}" }),
  );
  await page.goto("/contact/");
  await page.getByLabel("Full name").fill("Example Client");
  await page.getByLabel("Email address").fill("example@example.com");
  await page.getByLabel("Preferred way to connect").selectOption("Email");
  await page.getByLabel("Who is this for?").selectOption("Myself");
  await page
    .getByLabel("What would you most like to change?")
    .fill("A clearer budget.");
  await page.getByLabel("I agree").check();
  await page.getByRole("button", { name: "Send my introduction" }).click();
}
test("confirmed delivery celebrates and clears the form", async ({ page }) => {
  await completeForm(page, 200);
  await expect(page.getByRole("status")).toContainText("Your inquiry was sent");
  await expect(page.getByLabel("Full name")).toHaveValue("");
  await expect(page.locator("#submit")).toBeDisabled();
  await expect(page.locator("canvas")).toHaveCount(1);
});
test("rejected delivery preserves answers without confetti", async ({
  page,
}) => {
  await completeForm(page, 422);
  await expect(page.getByRole("status")).toContainText(
    "couldn’t confirm delivery",
  );
  await expect(page.getByLabel("Full name")).toHaveValue("Example Client");
  await expect(page.locator("#submit")).toBeEnabled();
  await expect(page.locator("canvas")).toHaveCount(0);
});
test("reduced motion confirms success without animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await completeForm(page, 200);
  await expect(page.getByRole("status")).toContainText("Your inquiry was sent");
  await expect(page.locator("canvas")).toHaveCount(0);
});
