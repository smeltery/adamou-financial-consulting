type Field = [name: string, label: string, example: number, unit?: string];
export const calculators: {
  id: string;
  title: string;
  slug: string;
  guide: string;
  question: string;
  fields: Field[];
  formula: string;
  note: string;
}[] = [
  {
    id: "budget",
    slug: "monthly-budget",
    guide:
      "Start with a typical month, including irregular bills divided across the year. A positive result is money still to assign; a shortfall means the listed commitments exceed take-home income. Try changing one category before changing several.",
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
    slug: "emergency-fund",
    guide:
      "Use essential expenses rather than your total income. Compare different coverage periods, then review the gap between your chosen target and current cash savings. The example coverage is a starting value, not a recommendation.",
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
    slug: "savings-goal",
    guide:
      "Choose one goal and count only savings assigned to it. Compare a contribution you can sustain with a higher or lower amount. This estimate counts full monthly contributions and does not assume interest.",
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
    slug: "debt-payoff",
    guide:
      "Enter one balance and its APR. Compare a payment your budget supports with a slightly higher payment. If payments do not cover interest, the calculator will explain why this model cannot produce a payoff date.",
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
    slug: "net-worth",
    guide:
      "Use a consistent date for your estimates. Include the value of a property and its outstanding mortgage separately, and avoid counting an account twice. A net-worth total is a snapshot, not a measure of available spending money.",
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
    slug: "compound-growth",
    guide:
      "Separate the money you contribute from hypothetical growth. Try different time horizons and rates, including zero, to see how strongly the assumption affects the result. A smooth projected balance does not describe real market fluctuations.",
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
    slug: "loan-payment",
    guide:
      "Use the amount borrowed, a fixed interest rate, and the repayment term. Compare the monthly payment and total interest together. Budget separately for fees, insurance, or other costs this estimate does not include.",
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
    slug: "inflation",
    guide:
      "Start with the cost of a specific expense today. Change the time horizon or assumed rate to explore possible future costs. This is a constant-rate scenario, not a prediction of prices in your country.",
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
  {
    id: "contribution",
    slug: "monthly-savings",
    title: "Monthly savings",
    question: "Work backward from a goal and a deadline to a monthly amount.",
    fields: [
      ["target", "Goal amount", 12000],
      ["saved", "Savings already assigned", 3000],
      ["months", "Months until your goal", 18, "months"],
    ],
    formula: "Monthly contribution = max(0, goal − saved) ÷ months remaining.",
    note: "Assumes equal end-of-month contributions, no interest, no withdrawals, and a whole number of months. Rounded currency displays may leave a small final adjustment.",
    guide:
      "Start with a goal and a realistic time horizon, then compare the required contribution with your monthly budget. Changing the deadline changes the arithmetic, not what your budget can support.",
  },
  {
    id: "ratio",
    slug: "debt-to-income",
    title: "Debt-to-income",
    question: "See what share of gross monthly income goes to debt payments.",
    fields: [
      ["gross", "Gross monthly income", 6000],
      ["housing", "Monthly mortgage or rent payment", 1500],
      ["debts", "Other required monthly debt payments", 500],
    ],
    formula:
      "Debt-to-income percentage = (housing payment + other monthly debt payments) ÷ gross monthly income × 100.",
    note: "This scenario includes your housing payment plus other required debt payments. Gross income is before deductions. It is not a credit assessment or lending decision; lender definitions and included obligations vary.",
    guide:
      "Use income and required payments from the same month, and count each payment once. This ratio uses gross income, so it does not show the cash left after taxes and living expenses. Use the budget tool for that view.",
  },
  {
    id: "pay",
    slug: "hourly-pay",
    title: "Hourly pay",
    question:
      "Turn an hourly rate and work schedule into gross income estimates.",
    fields: [
      ["rate", "Hourly pay rate", 25],
      ["hours", "Paid hours each week", 40, "hours/week"],
      ["weeks", "Paid weeks each year", 50, "weeks/year"],
    ],
    formula:
      "Annual gross pay = hourly rate × paid hours per week × paid weeks per year. Monthly average = annual gross pay ÷ 12.",
    note: "Straight-time gross pay only, before taxes and deductions. Excludes overtime premiums, tips, bonuses, and benefits. Monthly average is not an actual paycheck amount; hours and paid weeks are assumed constant.",
    guide:
      "Use paid weeks rather than automatically counting every week of the year. Compare the annual total and monthly average, then use your actual take-home income for budgeting. Overtime and variable schedules need separate treatment.",
  },
  {
    id: "recurring",
    slug: "recurring-costs",
    title: "Recurring costs",
    question: "See the longer-term total of subscriptions and memberships.",
    fields: [
      ["monthly", "Combined monthly subscriptions", 85],
      ["annual", "Combined annual memberships", 240],
      ["years", "Years to compare", 5, "years"],
    ],
    formula:
      "Annual cost = monthly subscriptions × 12 + annual memberships. Period total = annual cost × years.",
    note: "Assumes prices stay unchanged and every subscription renews. Excludes inflation, promotional changes, cancellation fees, and investment returns. Do not count the same subscription in both fields.",
    guide:
      "Add up monthly and yearly charges separately. Review how much you use each service before deciding what to change. The total is spending under a constant-price scenario, not automatically available savings.",
  },
  {
    id: "savingrate",
    slug: "savings-rate",
    title: "Savings rate",
    question: "See how much of your monthly take-home income you set aside.",
    fields: [
      ["income", "Monthly take-home income", 4500],
      ["saved", "Monthly amount set aside", 675],
    ],
    formula:
      "Savings rate = monthly amount set aside ÷ monthly take-home income × 100.",
    note: "Uses take-home income and savings from the same month. Do not include payroll contributions withheld before take-home pay unless you adjust both inputs consistently. This is a chosen cash-flow measure, not a universal savings benchmark.",
    guide:
      "Choose what you count as savings and keep that definition consistent when comparing months. The percentage does not tell you whether your savings are enough for a particular goal. Compare it with your budget and goal timeline.",
  },
  {
    id: "simple",
    slug: "simple-interest",
    title: "Simple interest",
    question: "Explore interest calculated on an unchanged starting amount.",
    fields: [
      ["principal", "Starting amount", 5000],
      ["rate", "Annual simple interest rate", 4, "%"],
      ["months", "Duration in months", 18, "months"],
    ],
    formula:
      "Interest = principal × annual rate / 100 × months / 12. Total = principal + interest.",
    note: "Simple interest only: interest does not earn additional interest. Assumes the principal and annual rate stay unchanged, with no deposits, repayments, fees, or taxes. This is not an amortized-loan calculation or a quoted account return.",
    guide:
      "Use this tool only for a simple-interest scenario. Compare the interest amount with the original principal. For interest that compounds or a balance with monthly repayments, choose the matching growth or loan tool instead.",
  },
  {
    id: "discount",
    slug: "discount-savings",
    title: "Discount savings",
    question:
      "Calculate the sale price and saving from one percentage discount.",
    fields: [
      ["price", "Original price", 120],
      ["discount", "Discount percentage", 25, "%"],
    ],
    formula:
      "Saving = original price × discount / 100. Sale price = original price − saving.",
    note: "One percentage discount on the entered original price. Excludes tax, delivery, fees, rebates, and stacked offers. The saving is a price difference, not money earned or automatically added to savings.",
    guide:
      "Compare the final price with what you intended to spend, not just the size of the discount. Confirm the original price and check additional charges separately. A lower price does not change whether the purchase fits your budget.",
  },
  {
    id: "costuse",
    slug: "cost-per-use",
    title: "Cost per use",
    question:
      "Compare the cost of something with how often you expect to use it.",
    fields: [
      ["price", "Purchase price or subscription cost", 240],
      ["upkeep", "Additional costs over the same period", 60],
      ["uses", "Expected number of uses", 60, "uses"],
    ],
    formula:
      "Cost per use = (purchase or subscription cost + additional costs) ÷ expected uses.",
    note: "Use the same ownership or subscription period for costs and uses. Assumes every expected use occurs. Excludes financing, resale value, and costs you do not enter. A low cost per use alone does not establish affordability.",
    guide:
      "Choose a realistic number of uses before comparing options. Include upkeep or additional fees over the same period. Compare a lower-use scenario too; the estimate depends as much on actual use as it does on price.",
  },
];
