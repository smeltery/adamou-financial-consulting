import { uiIcon } from "../identity";
import { regions } from "./currencies";
import { closing } from "../sections";
type Field = [name: string, label: string, example: number, unit?: string];
export const calculators: {
  id: string;
  title: string;
  question: string;
  fields: Field[];
  formula: string;
  note: string;
}[] = [
  {
    id: "budget",
    title: "Monthly budget",
    question: "See what’s left after your monthly commitments.",
    fields: [
      ["income", "Monthly take-home income", 4500],
      ["housing", "Housing and utilities", 1600],
      ["living", "Food and transportation", 700],
      ["debt", "Debt payments", 300],
      ["other", "Other spending and planned savings", 800],
    ],
    formula:
      "Take-home income − housing − living costs − debt payments − other allocations.",
    note: "Use one month for every amount. Include irregular bills as monthly equivalents. Money remaining is unallocated—not automatically saved.",
  },
  {
    id: "emergency",
    title: "Emergency fund",
    question: "Explore the cash buffer that matches your chosen coverage.",
    fields: [
      ["expenses", "Essential monthly expenses", 2800],
      ["months", "Months to cover", 3, "months"],
      ["saved", "Emergency savings today", 2500],
    ],
    formula:
      "Target = essential monthly expenses × coverage months. Gap = target − current savings, with a minimum of zero.",
    note: "Include essential bills and required debt payments. Choose coverage for your situation; the example is not a recommendation. No interest or investment growth is included.",
  },
  {
    id: "savings",
    title: "Savings goal",
    question: "Estimate how many monthly contributions reach your goal.",
    fields: [
      ["target", "Savings goal", 10000],
      ["saved", "Already saved toward this goal", 2000],
      ["monthly", "Monthly contribution", 400],
    ],
    formula:
      "Months = remaining goal ÷ monthly contribution, rounded up to a whole month.",
    note: "Assumes a constant contribution each month, no withdrawals, and no interest. The last contribution may be smaller. This is a timeline estimate, not a calendar promise.",
  },
  {
    id: "debt",
    title: "Debt payoff",
    question:
      "Compare what a fixed monthly payment could mean for one balance.",
    fields: [
      ["balance", "Current debt balance", 5000],
      ["apr", "Annual percentage rate", 18, "% APR"],
      ["payment", "Fixed monthly payment", 250],
    ],
    formula:
      "Monthly interest = balance × APR ÷ 12 ÷ 100. Add interest, subtract payment, then repeat until the balance is paid.",
    note: "Assumes a constant APR, monthly interest followed by payment, and no new charges or fees. Actual lenders may use daily interest. Estimates stop at 100 years; this does not calculate a lender’s minimum payment.",
  },
  {
    id: "networth",
    title: "Net worth",
    question: "Put what you own and what you owe in one snapshot.",
    fields: [
      ["cash", "Cash and savings", 10000],
      ["investments", "Investments and retirement accounts", 25000],
      ["property", "Property and other assets", 18000],
      ["loans", "Mortgages and other loans", 12000],
      ["cards", "Credit cards and other debts", 3000],
    ],
    formula: "Net worth = cash + investments + property − loans − other debts.",
    note: "Use current estimates, include each asset or debt only once, and include any mortgage alongside the property value. This snapshot does not account for taxes or selling costs.",
  },
  {
    id: "growth",
    title: "Compound growth",
    question: "Explore how regular contributions could grow over time.",
    fields: [
      ["initial", "Starting balance", 10000],
      ["monthly", "Monthly contribution", 200],
      ["rate", "Assumed annual growth rate", 5, "%"],
      ["years", "Time horizon", 10, "years"],
    ],
    formula:
      "Each month: balance × (1 + annual rate / 1200) + contribution. Repeat for years × 12 months.",
    note: "Contributions arrive at month-end. Assumes constant nonnegative growth compounded monthly; excludes fees, taxes, inflation, and withdrawals. Actual returns vary and can be negative. The example rate is not a forecast.",
  },
  {
    id: "loan",
    title: "Loan payment",
    question:
      "Estimate the monthly principal and interest for a fixed-rate loan.",
    fields: [
      ["principal", "Amount borrowed", 20000],
      ["rate", "Annual interest rate", 6, "%"],
      ["years", "Loan term", 5, "years"],
    ],
    formula:
      "Payment = principal × r / (1 − (1 + r)^(−n)), where r = annual rate / 1200 and n = years × 12. At zero interest, payment = principal / n.",
    note: "Fixed rate, equal monthly payments, and monthly interest. Use the interest rate, not an APR that includes fees. Excludes fees, insurance, property taxes, and other costs. A lender’s actual payment may differ.",
  },
  {
    id: "inflation",
    title: "Inflation",
    question: "See how a steady rise in prices could change a future expense.",
    fields: [
      ["cost", "Cost today", 1000],
      ["rate", "Assumed annual inflation", 3, "%"],
      ["years", "Years from now", 10, "years"],
    ],
    formula: "Future cost = cost today × (1 + annual inflation / 100)^years.",
    note: "Assumes the same nonnegative inflation rate each year. This is a scenario, not a forecast or a country-specific inflation estimate. Individual expenses may change differently.",
  },
];
export const toolsPage = `<section class="wrap contact-heading tools-heading"><div><p class="eyebrow">THE AFIN TOOLKIT</p><h1>A little math.<br> <em>A clearer picture.</em></h1><p class="lead">Try eight everyday financial tools. Change the numbers, explore a possibility, and bring your questions to Matt.</p></div><aside><span class="card-icon">${uiIcon("shield")}</span><strong>Yours to explore.</strong><p>No account needed. Calculations happen in your browser. Your numbers aren’t sent to Matt, stored, or included in analytics.</p><span>Planning estimates · Your selected currency</span></aside></section>
<section class="wrap tool-workspace" aria-label="Financial calculators"><div class="tool-controls"><div class="tool-picker"><span class="tool-picker-label">Your calculator</span><button type="button" data-search="tools" aria-haspopup="dialog" aria-controls="site-search">${uiIcon("tools")}<span><strong id="selected-tool">Monthly budget</strong><small>Browse all ${calculators.length} tools</small></span>${uiIcon("switch")}</button></div><label class="currency-picker">Country and currency<select id="tool-currency">${regions.map(([country, locale, code]) => `<option value="${locale}">${country} · ${code}</option>`).join("")}</select><span>Changes units and formatting, not exchange rates. Enter every amount in the selected currency.</span></label></div><noscript><p>Enable JavaScript for interactive results. Each tool’s formula and assumptions are available below.</p></noscript>${calculators.map(({ id, title, question, fields, formula, note }) => `<article class="calculator" id="tool-${id}"><div class="tool-intro"><p class="eyebrow">EXPLORE YOUR NUMBERS</p><h2>${title}</h2><p>${question}</p></div><form data-calculator="${id}" autocomplete="off"><div class="tool-fields">${fields.map(([name, label, example, unit]) => `<label>${label} <span ${unit ? "" : "data-currency-unit"}>(${unit || "USD"})</span><input type="number" inputmode="decimal" name="${name}" value="${example}" min="0" max="${unit === "months" ? 120 : unit ? 100 : 1000000000}" step="${unit === "months" || unit === "years" ? 1 : 0.01}" required disabled></label>`).join("")}<button class="button" type="submit" disabled>Calculate</button><button class="reset-tool" type="reset" disabled>Reset example</button></div><div class="tool-result" role="status" aria-live="polite" aria-atomic="true"><p>Example values are shown. Change them to explore your situation.</p></div></form><details class="tool-method" open><summary>How this estimate works</summary><p>${formula}</p><p>${note}</p></details></article>`).join("")}</section>
<section class="wrap section tool-guide"><p class="eyebrow">MAKE THE NUMBERS USEFUL</p><h2>Explore. Compare. Talk it through.</h2><div class="reading-cards"><article><span>01</span><h3>Start with a snapshot.</h3><p>Replace the examples with your own estimates. Check that all amounts use the same time period.</p></article><article><span>02</span><h3>Change one thing.</h3><p>Try a different contribution or monthly payment and see how the estimate responds.</p></article><article><span>03</span><h3>Add the human context.</h3><p>The tools do arithmetic. Matt can discuss how your goals and responsibilities fit into a practical plan.</p></article></div><p class="micro">These educational estimates aren’t personalized financial advice. Review the assumptions before using a result for a decision.</p></section>${closing}`;
