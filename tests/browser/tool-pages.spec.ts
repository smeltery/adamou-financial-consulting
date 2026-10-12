import { test, expect } from "@playwright/test";
import { calculators } from "../../src/tools/catalog";

for (const tool of calculators) {
  test(`${tool.title} has a working, crawlable dedicated page`, async ({
    page,
    request,
  }) => {
    const path = `/tools/${tool.slug}/`;
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      `${tool.title} calculator`,
    );
    await expect(page.locator(".calculator:visible")).toHaveCount(1);
    await expect(page.locator(".calculator input").first()).toBeEnabled();
    await expect(page.locator(".tool-result")).not.toContainText(
      "Example values are shown",
    );
    await page.getByLabel("Country and currency").selectOption("en-GB");
    await expect(page.locator("[data-currency-unit]").first()).toHaveText(
      "(GBP)",
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `https://adamou-financial-consulting.vercel.app${path}`,
    );
    const markdown = await request.get(path, {
      headers: { Accept: "text/markdown" },
    });
    expect(markdown.status()).toBe(200);
    expect(markdown.headers()["content-type"]).toContain("text/markdown");
    expect(await markdown.text()).toContain(tool.formula);
    const direct = await request.get(`/content/tools/${tool.slug}.md`);
    expect(direct.headers().link).toContain(`${path}>; rel="canonical"`);
    expect(
      (await request.get(path.slice(0, -1), { maxRedirects: 0 })).status(),
    ).toBe(308);
  });
}

test("the tool library and sitemap expose every calculator", async ({
  page,
  request,
}) => {
  await page.goto("/tools/");
  for (const tool of calculators) {
    await expect(
      page
        .locator(".calculator-library")
        .getByRole("link", { name: new RegExp(tool.title) }),
    ).toHaveAttribute("href", `/tools/${tool.slug}/`);
  }
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const tool of calculators)
    expect(sitemap).toContain(`/tools/${tool.slug}/`);
  expect((await request.get("/tools/not-a-calculator/")).status()).toBe(404);
});
