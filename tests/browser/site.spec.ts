import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const path of [
  "/",
  "/services/",
  "/about/",
  "/approach/",
  "/tools/",
  "/brand/",
  "/contact/",
  "/privacy/",
]) {
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

test("mobile navigation opens and navigates to a dedicated page", async ({
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
  await expect(page).toHaveURL(/\/services\/$/);
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

test("email CTA stays readable on hover", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Or email Matt directly" });
  await link.hover();
  const audit = await new AxeBuilder({ page })
    .include(".cta")
    .withRules(["color-contrast"])
    .analyze();
  expect(audit.violations).toEqual([]);
});

test("agents can discover and read every page without JavaScript", async ({
  request,
}) => {
  const missing = await request.get("/missing-page", {
    headers: { Accept: "text/markdown" },
  });
  expect(missing.status()).toBe(404);
  expect(missing.headers()["content-type"]).toContain("text/markdown");
  expect(await missing.text()).toContain("llms.txt");
  const sitemap = await request.get("/sitemap.xml");
  const urls = [...(await sitemap.text()).matchAll(/<loc>(.*?)<\/loc>/g)];
  expect(urls).toHaveLength(24);
  for (const [, url] of urls) {
    const path = new URL(url).pathname;
    const response = await request.get(path, {
      headers: { Accept: "text/markdown" },
    });
    expect(response.headers()["content-type"]).toContain("text/markdown");
    expect(await response.text()).toContain("Source:");
    const html = await (await request.get(path)).text();
    expect(html).toContain(`rel="canonical" href="${url}"`);
    expect(
      JSON.parse(html.match(/application\/ld\+json">(.*?)<\/script>/s)![1])[
        "@graph"
      ],
    ).toHaveLength(4);
  }
  expect(await (await request.get("/llms.txt")).text()).toContain(
    "Contact workflow",
  );
});

test("FAQ supports keyboard navigation and keeps one answer open", async ({
  page,
}) => {
  await page.goto("/approach/");
  const rows = page.locator(".faq details");
  await rows.nth(0).locator("summary").focus();
  await page.keyboard.press("Enter");
  await expect(rows.nth(0)).toHaveAttribute("open", "");
  await expect(rows.nth(0).locator("p")).toBeVisible();
  await rows.nth(1).locator("summary").click();
  await expect(rows.nth(1)).toHaveAttribute("open", "");
  await expect(rows.nth(0)).not.toHaveAttribute("open", "");
  await page.keyboard.press("Space");
  await expect(rows.nth(1)).not.toHaveAttribute("open", "");
});
