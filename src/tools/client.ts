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
import { moneyFormat } from "./currencies";
let currencyFormatter = moneyFormat();
const money = (value: number) => currencyFormatter.format(value);
function result(id: string, v: Record<string, number>) {
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
export function setupTools() {
  const currency = document.querySelector<HTMLSelectElement>("#tool-currency");
  currency?.addEventListener("change", () => {
    currencyFormatter = moneyFormat(currency.value);
    const { currency: code } = currencyFormatter.resolvedOptions();
    document.querySelectorAll("[data-currency-unit]").forEach((label) => {
      label.textContent = `(${code})`;
    });
    document
      .querySelectorAll("[data-calculator]")
      .forEach((form) => form.dispatchEvent(new Event("input")));
  });
  const forms = document.querySelectorAll<HTMLFormElement>("[data-calculator]");
  forms.forEach((form) => {
    form
      .querySelectorAll<HTMLInputElement | HTMLButtonElement>("input, button")
      .forEach((control) => {
        control.disabled = false;
      });
    const output = form.querySelector<HTMLElement>(".tool-result")!;
    const update = () => {
      if (!form.checkValidity()) {
        output.textContent =
          "Enter a valid amount in every field. Use nonnegative numbers within the displayed limits.";
        return;
      }
      const values = Object.fromEntries(
        [...new FormData(form)].map(([key, value]) => [key, Number(value)]),
      );
      const [amount, label, detail] = result(form.dataset.calculator!, values);
      output.replaceChildren(
        ...[label, amount, detail].map((text, index) => {
          const element = document.createElement(index === 1 ? "strong" : "p");
          element.textContent = text;
          return element;
        }),
      );
      const id = form.dataset.calculator;
      const target =
        id === "emergency"
          ? values.expenses * values.months
          : id === "savings"
            ? values.target
            : 0;
      if (target > 0) {
        const percent = Math.min(100, (values.saved / target) * 100);
        const caption = document.createElement("p");
        caption.textContent = `${percent.toFixed(0)}% of target already saved`;
        const meter = document.createElement("meter");
        meter.min = 0;
        meter.max = 100;
        meter.value = percent;
        meter.setAttribute("aria-label", "Share of target already saved");
        output.append(caption, meter);
      }
    };
    form.addEventListener("input", update);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      update();
    });
    form.addEventListener("reset", () => setTimeout(update, 0));
    update();
  });
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-tool]");
  const select = (id: string) => {
    buttons.forEach((button) =>
      button.setAttribute("aria-pressed", String(button.dataset.tool === id)),
    );
    forms.forEach((form) => {
      form.closest<HTMLElement>(".calculator")!.hidden =
        form.dataset.calculator !== id;
    });
  };
  buttons.forEach((button) =>
    button.addEventListener("click", () => {
      location.hash = `tool-${button.dataset.tool!}`;
    }),
  );
  const selectFromHash = () => {
    const id = location.hash.replace("#tool-", "");
    select(
      [...buttons].some((button) => button.dataset.tool === id) ? id : "budget",
    );
  };
  if (forms.length) {
    window.addEventListener("hashchange", selectFromHash);
    selectFromHash();
  }
}
