import { calculators } from "../../src/tools/catalog";
import { test, expect } from "@playwright/test";
test("search metadata is unique and structured entities match the public content", async ({
  request,
}) => {
  const titles = new Set<string>(),
    descriptions = new Set<string>();
  for (const path of [
    "",
    "services",
    "about",
    "approach",
    "tools",
    "contact",
    "brand",
    "privacy",
  ]) {
    const response = await request.get(`/${path ? `${path}/` : ""}`);
    const html = await response.text();
    expect(response.ok()).toBe(true);
    titles.add(html.match(/<title>(.*?)<\/title>/)![1]);
    descriptions.add(html.match(/name="description" content="([^"]+)"/)![1]);
    expect(html).toContain('property="og:image:height" content="630"');
    expect(html).not.toContain('content="noindex"');
    const graph = JSON.parse(
      html.match(/application\/ld\+json">(.*?)<\/script>/s)![1],
    )["@graph"];
    const person = graph.find(
      (item: Record<string, unknown>) => item["@type"] === "Person",
    );
    expect(person.name).toBe("Matt Adamou");
    if (path === "about")
      expect(
        graph.find(
          (item: Record<string, unknown>) => item["@type"] === "AboutPage",
        ).mainEntity["@id"],
      ).toBe(person["@id"]);
    if (path === "tools")
      expect(
        graph.find(
          (item: Record<string, unknown>) => item["@type"] === "CollectionPage",
        ).mainEntity.itemListElement,
      ).toHaveLength(calculators.length);
    const raw = await request.get(`/pages/${path || "home"}.html`, {
      maxRedirects: 0,
    });
    expect(raw.status()).toBe(308);
    expect(raw.headers().location).toBe(`/${path ? `${path}/` : ""}`);
    const markdown = await request.get(`/content/${path || "home"}.md`);
    expect(markdown.headers().link).toContain(
      `/${path ? `${path}/` : ""}>; rel="canonical"`,
    );
  }
  expect(titles.size).toBe(8);
  expect(descriptions.size).toBe(8);
});
