import { test, expect, type Page } from "@playwright/test";
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
  await chooseTool(page, "Emergency fund");
  await expect(result).toContainText("$8,400.00");
  await chooseTool(page, "Savings goal");
  await expect(result).toContainText("20 months");
  await active.getByLabel("Monthly contribution").fill("0");
  await expect(result).toContainText("No timeline yet");
  await chooseTool(page, "Debt payoff");
  await active.getByLabel("Fixed monthly payment").fill("1");
  await expect(result).toContainText("No payoff within this model");
  await chooseTool(page, "Net worth");
  await expect(result).toContainText("$38,000.00");
  expect(requests).toEqual([]);
});

test("currency selection updates units and every result without changing inputs", async ({
  page,
}) => {
  await page.goto("/tools/");
  await page.getByLabel("Country and currency").selectOption("en-GB");
  await expect(page.locator(".calculator:visible .tool-result")).toContainText(
    "£1,100.00",
  );
  await expect(page.getByLabel("Monthly take-home income (GBP)")).toHaveValue(
    "4500",
  );
  await chooseTool(page, "Emergency fund");
  await expect(page.locator(".calculator:visible .tool-result")).toContainText(
    "£8,400.00",
  );
  await page.getByLabel("Country and currency").selectOption("de-DE");
  await expect(page.locator(".calculator:visible .tool-result")).toContainText(
    "8.400,00",
  );
});

async function chooseTool(page: Page, name: string) {
  await page.locator(".tool-picker button").click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name, exact: true })
    .click();
}
