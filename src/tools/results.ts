import {
  monthlyBudget,
  emergencyFund,
  savingsGoal,
  debtPayoff,
  netWorth,
  compoundGrowth,
  loanPayment,
  futureCost,
} from "./math";

export function result(
  id: string,
  v: Record<string, number>,
  formatter: Intl.NumberFormat,
) {
  const money = (value: number) => formatter.format(value);
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
