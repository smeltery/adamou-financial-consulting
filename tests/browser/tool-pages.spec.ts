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
    await expect(page.locator(".preparation li")).toHaveCount(3);
    await expect(page.locator(".faq details")).toHaveCount(2);
    await page.locator(".faq summary").first().click();
    await expect(page.locator(".faq details").first()).toHaveAttribute(
      "open",
      "",
    );
    const related = page.locator(".related-tools nav a");
    await expect(related).toHaveCount(3);
    expect(
      await related.evaluateAll((links) =>
        links.map((link) => link.getAttribute("href")),
      ),
    ).not.toContain(path);
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

test("the library filters by category and search, and recovers from no matches", async ({
  page,
}) => {
  await page.goto("/tools/");
  const cards = page.locator(".calculator-library > a:visible");
  await expect(cards).toHaveCount(8);
  await page
    .getByRole("button", { name: "Debt & borrowing", exact: true })
    .click();
  await expect(cards).toHaveCount(2);
  const search = page.getByRole("searchbox", { name: "Find a calculator" });
  await search.fill("loan");
  await expect(cards).toHaveCount(1);
  await expect(cards.first()).toContainText("Loan payment");
  await search.fill("nothing matches this");
  await expect(cards).toHaveCount(0);
  await expect(page.locator(".library-empty")).toBeVisible();
  await page.getByRole("button", { name: "Show all tools" }).click();
  await expect(cards).toHaveCount(8);
  await expect(search).toBeFocused();
  await expect(
    page.getByRole("button", { name: "All tools", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
});
