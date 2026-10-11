import { test, expect } from "@playwright/test";
test("five calculators update, validate, and reset without sending inputs", async ({
  page,
}) => {
  await page.goto("/tools/");
  await page.waitForLoadState("networkidle");
  const requests: string[] = [];
  page.on("request", (request) => requests.push(request.url()));
  const active = page.locator(".calculator:visible");
  const result = active.locator(".tool-result");
  await expect(result).toContainText("$1,100.00");
  await active.getByLabel("Monthly take-home income").fill("1000");
  await expect(result).toContainText("Monthly shortfall");
  await active.getByLabel("Monthly take-home income").fill("");
  await expect(result).toContainText("Enter a valid amount");
  await active.getByRole("button", { name: "Reset example" }).click();
  await expect(result).toContainText("$1,100.00");
  await page
    .getByRole("button", { name: "Emergency fund", exact: true })
    .click();
  await expect(result).toContainText("$8,400.00");
  await page.getByRole("button", { name: "Savings goal", exact: true }).click();
  await expect(result).toContainText("20 months");
  await active.getByLabel("Monthly contribution").fill("0");
  await expect(result).toContainText("No timeline yet");
  await page.getByRole("button", { name: "Debt payoff", exact: true }).click();
  await active.getByLabel("Fixed monthly payment").fill("1");
  await expect(result).toContainText("No payoff within this model");
  await page.getByRole("button", { name: "Net worth", exact: true }).click();
  await expect(result).toContainText("$38,000.00");
  expect(requests).toEqual([]);
});
