import { test, expect } from "bun:test";
import {
  monthlyBudget,
  emergencyFund,
  savingsGoal,
  debtPayoff,
  netWorth,
} from "../src/tools/math";
test("budget preserves surplus, shortfall, and zero income", () => {
  expect(monthlyBudget(4500, [1600, 700, 300, 800])).toEqual({
    spending: 3400,
    remaining: 1100,
  });
  expect(monthlyBudget(0, [100]).remaining).toBe(-100);
});
test("emergency target never reports a negative savings gap", () => {
  expect(emergencyFund(2800, 3, 2500)).toEqual({ target: 8400, gap: 5900 });
  expect(emergencyFund(100, 3, 500).gap).toBe(0);
});
test("savings rounds up and handles an achieved goal or no contributions", () => {
  expect(savingsGoal(1000, 100, 400).months).toBe(3);
  expect(savingsGoal(1000, 1000, 0).months).toBe(0);
  expect(savingsGoal(1000, 0, 0).months).toBeNull();
});
test("payoff handles zero APR, partial last payment, interest, and no progress", () => {
  expect(debtPayoff(1000, 0, 300)).toEqual({
    months: 4,
    interest: 0,
    total: 1000,
  });
  expect(debtPayoff(1000, 12, 1010)).toEqual({
    months: 1,
    interest: 10,
    total: 1010,
  });
  expect(debtPayoff(1000, 12, 10)).toBeNull();
  expect(debtPayoff(1000, 0, 0)).toBeNull();
  expect(debtPayoff(1000, 0, 0.01)).toBeNull();
  expect(debtPayoff(0, 12, 0)?.months).toBe(0);
});
test("net worth supports negative balances", () => {
  expect(netWorth([10000, 25000, 18000], [12000, 3000])).toBe(38000);
  expect(netWorth([10], [100])).toBe(-90);
});

import { moneyFormat } from "../src/tools/currencies";
test("currency formatting follows the selected region without conversion", () => {
  expect(moneyFormat("en-GB").format(1100)).toBe("£1,100.00");
  expect(moneyFormat("de-DE").format(1100)).toContain("1.100,00");
  expect(moneyFormat("ja-JP").resolvedOptions().maximumFractionDigits).toBe(0);
  expect(moneyFormat("unknown").resolvedOptions().currency).toBe("USD");
});

import { compoundGrowth, loanPayment, futureCost } from "../src/tools/math";
test("growth models month-end deposits and zero growth or time", () => {
  expect(compoundGrowth(1000, 100, 0, 1)).toEqual({
    balance: 2200,
    contributed: 2200,
    growth: 0,
  });
  expect(compoundGrowth(1000, 100, 12, 1).balance).toBeCloseTo(2395.075331, 4);
  expect(compoundGrowth(1000, 100, 5, 0).balance).toBe(1000);
});
test("loan payments handle zero interest, zero principal, and invalid term", () => {
  expect(loanPayment(1200, 0, 1)?.payment).toBe(100);
  expect(loanPayment(20000, 6, 5)?.payment).toBeCloseTo(386.65603, 4);
  expect(loanPayment(0, 6, 5)?.payment).toBe(0);
  expect(loanPayment(1200, 6, 0)).toBeNull();
});
test("inflation compounds annually and preserves zero-rate costs", () => {
  expect(futureCost(1000, 3, 10)).toBeCloseTo(1343.916379, 4);
  expect(futureCost(1000, 0, 10)).toBe(1000);
  expect(futureCost(1000, 3, 0)).toBe(1000);
});
