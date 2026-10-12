import {
  monthlyBudget,
  emergencyFund,
  savingsGoal,
  debtPayoff,
  netWorth,
  compoundGrowth,
  loanPayment,
  futureCost,
  monthlySavings,
  debtRatio,
  hourlyPay,
  recurringCosts,
  savingsRate,
  simpleInterest,
  discountPrice,
  costPerUse,
} from "./math";

export function result(
  id: string,
  v: Record<string, number>,
  formatter: Intl.NumberFormat,
) {
  const money = (value: number) => formatter.format(value);
  if (id === "savingrate") {
    const rate = savingsRate(v.income, v.saved);
    return [
      rate === null
        ? "No rate yet"
        : new Intl.NumberFormat(formatter.resolvedOptions().locale, {
            style: "percent",
            maximumFractionDigits: 1,
          }).format(rate / 100),
      "Share of take-home income set aside",
      rate === null
        ? "Enter take-home income greater than zero to calculate a savings rate."
        : `${money(v.saved)} set aside from ${money(v.income)} take-home income. Keep the period and income basis consistent.`,
    ];
  }
  if (id === "simple") {
    const estimate = simpleInterest(v.principal, v.rate, v.months);
    return [
      money(estimate.interest),
      "Simple interest over your period",
      `${money(estimate.total)} principal plus interest after ${v.months} months. No compounding or repayments.`,
    ];
  }
  if (id === "discount") {
    const estimate = discountPrice(v.price, v.discount);
    return [
      money(estimate.price),
      "Price after the discount",
      `${money(estimate.saved)} below the original ${money(v.price)} price. Tax, shipping, and other charges excluded.`,
    ];
  }
  if (id === "costuse") {
    const cost = costPerUse(v.price, v.upkeep, v.uses);
    return [
      cost === null ? "Add expected uses" : money(cost),
      "Estimated cost per use",
      cost === null
        ? "Enter at least one use to divide the total cost."
        : `${money(v.price + v.upkeep)} in total costs across ${v.uses} expected uses. Use the same period for both.`,
    ];
  }
  if (id === "contribution") {
    const monthly = monthlySavings(v.target, v.saved, v.months);
    return monthly === null
      ? [
          "Choose a deadline",
          "No monthly estimate yet",
          "Enter at least one month to spread the remaining goal across future contributions.",
        ]
      : [
          money(monthly),
          "Required monthly contribution",
          `${money(Math.max(0, v.target - v.saved))} left to fund over ${v.months} months. No interest assumed.`,
        ];
  }
  if (id === "ratio") {
    const ratio = debtRatio(v.gross, v.housing, v.debts);
    return [
      ratio === null
        ? "No ratio yet"
        : new Intl.NumberFormat(formatter.resolvedOptions().locale, {
            style: "percent",
            maximumFractionDigits: 1,
          }).format(ratio / 100),
      "Housing and debt share of gross income",
      ratio === null
        ? "Enter gross monthly income greater than zero to calculate the ratio."
        : `${money(v.housing + v.debts)} in monthly payments from ${money(v.gross)} gross income. Not a lending decision.`,
    ];
  }
  if (id === "pay") {
    const pay = hourlyPay(v.rate, v.hours, v.weeks);
    return [
      money(pay.annual),
      "Estimated annual gross pay",
      `${money(pay.monthly)} per month on average, before taxes and deductions. No overtime premium included.`,
    ];
  }
  if (id === "recurring") {
    const costs = recurringCosts(v.monthly, v.annual, v.years);
    return [
      money(costs.total),
      "Total recurring cost over your period",
      `${money(costs.yearly)} per year over ${v.years} years, assuming unchanged prices and renewals.`,
    ];
  }
  if (id === "budget") {
    const { spending, remaining } = monthlyBudget(v.income, [
      v.housing,
      v.living,
      v.debt,
      v.other,
    ]);
    return [
      money(remaining),
      remaining < 0 ? "Monthly shortfall" : "Unallocated each month",
      `${money(spending)} allocated from ${money(v.income)} take-home income.`,
    ];
  }

  if (id === "emergency") {
    const { target, gap } = emergencyFund(v.expenses, v.months, v.saved);
    return [
      money(target),
      "Your selected cash-buffer target",
      `${money(gap)} still to save. ${v.expenses > 0 ? (v.saved / v.expenses).toFixed(1) + " months currently covered." : "Enter essential expenses to estimate current coverage."}`,
    ];
  }

  if (id === "savings") {
    const { gap, months } = savingsGoal(v.target, v.saved, v.monthly);
    return [
      months === null ? "No timeline yet" : `${months} months`,
      months === 0
        ? "Your goal is already covered"
        : "Estimated time to your goal",
      months === null
        ? "Add a monthly contribution greater than zero to reach the remaining goal."
        : `${money(gap)} left to contribute. Interest is not included.`,
    ];
  }

  if (id === "debt") {
    const payoff = debtPayoff(v.balance, v.apr, v.payment);
    return payoff
      ? [
          `${payoff.months} months`,
          "Estimated time to pay off",
          `${money(payoff.interest)} in interest · ${money(payoff.total)} total paid.`,
        ]
      : [
          "Payment needs a closer look",
          "No payoff within this model",
          "The payment may not cover monthly interest, or repayment exceeds the 100-year calculation limit. Try a higher payment.",
        ];
  }

  if (id === "growth") {
    const growth = compoundGrowth(v.initial, v.monthly, v.rate, v.years);
    return [
      money(growth.balance),
      "Projected balance",
      `${money(growth.contributed)} contributed · ${money(growth.growth)} hypothetical growth. Not a guaranteed return.`,
    ];
  }

  if (id === "loan") {
    const loan = loanPayment(v.principal, v.rate, v.years);
    return loan
      ? [
          money(loan.payment),
          "Monthly principal and interest",
          `${money(loan.interest)} interest · ${money(loan.total)} total paid. Other costs excluded.`,
        ]
      : [
          "Choose a loan term",
          "No estimate yet",
          "Enter at least one year for the loan term.",
        ];
  }

  if (id === "inflation")
    return [
      money(futureCost(v.cost, v.rate, v.years)),
      "Estimated future cost",
      `The cost of something priced at ${money(v.cost)} today, after ${v.years} years at your assumed inflation rate.`,
    ];
  return [
    money(netWorth([v.cash, v.investments, v.property], [v.loans, v.cards])),
    "Estimated net worth",
    `${money(v.cash + v.investments + v.property)} in assets − ${money(v.loans + v.cards)} in debts. A snapshot, not a measure of your worth as a person.`,
  ];
}
