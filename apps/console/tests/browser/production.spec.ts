import { test, expect } from "@playwright/test";
test("production offers no demo or anonymous path to client records", async ({
  page,
}) => {
  await page.goto("http://127.0.0.1:3102/");
  await expect(
    page.getByRole("heading", { name: "Welcome back, Matt." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Explore with sample data" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Add client", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "noindex,nofollow",
  );
  const files = await page
    .locator("script[src]")
    .evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLScriptElement).src),
    );
  for (const file of files) {
    const body = await (await page.request.get(file)).text();
    expect(body).not.toContain("Alex Morgan");
    expect(body).not.toContain("sampleClients");
  }
});
