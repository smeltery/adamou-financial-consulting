import { test, expect } from "@playwright/test";
import { spawnSync } from "node:child_process";

test("the live preview keeps calculators working after checks and a build", async ({
  page,
}) => {
  test.setTimeout(120_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/tools/monthly-budget/");
  await page.getByLabel("Monthly take-home income").fill("6000");
  await expect(page.locator(".tool-result")).toContainText("$2,600.00");
  // Playwright runs on Bun; Astro's renderer uses the Node runtime pinned by Flox.
  const node = process.env.FLOX_ENV
    ? `${process.env.FLOX_ENV}/bin/node`
    : "node";
  for (const command of ["check", "build"]) {
    const run = spawnSync(
      node,
      ["../../node_modules/astro/bin/astro.mjs", command],
      {
        encoding: "utf8",
        timeout: 60_000,
      },
    );
    expect(run.status, run.stderr + run.stdout).toBe(0);
  }
  const crawl = spawnSync("bun", ["scripts/crawl.ts"], { encoding: "utf8" });
  expect(crawl.status, crawl.stderr).toBe(0);
  await page.reload();
  await page.getByLabel("Monthly take-home income").fill("6000");
  await expect(page.locator(".tool-result")).toContainText("$2,600.00");
  expect(errors).toEqual([]);
});
