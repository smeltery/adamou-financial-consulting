# Financial tools

Open `/tools/` and select **Your calculator** to browse the searchable tool library. Replace the example values with your own
estimates. Results update immediately; **Reset example** restores the defaults.
Choose a country and currency to change units and result formatting. This does
not convert amounts or fetch exchange rates. Use the selected currency for every
input; switching preserves the numbers you entered. Inputs stay in memory in the browser and are not
saved, sent to Matt, or included in analytics. Reloading clears your changes.

| Tool            | Method                                                     | Assumptions                                                      |
| --------------- | ---------------------------------------------------------- | ---------------------------------------------------------------- |
| Monthly budget  | Income minus expenses and planned allocations              | All values cover one month; income is after tax                  |
| Emergency fund  | Essential expenses × selected months                       | No interest; coverage is your choice                             |
| Savings goal    | Remaining goal ÷ monthly contribution, rounded up          | Constant monthly contributions; no interest or withdrawals       |
| Debt payoff     | Add balance × APR / 1200, then subtract payment each month | Fixed APR and payment; no new charges or fees; 1,200-month limit |
| Net worth       | Total assets minus total debts                             | Current estimates; no selling costs or taxes                     |
| Compound growth | Apply monthly growth, then add each contribution           | Constant assumed nonnegative rate; no taxes, fees, or inflation  |
| Loan payment    | Fixed-rate monthly amortization                            | Principal and interest only; no fees, insurance, or taxes        |
| Inflation       | Cost × (1 + annual rate / 100)^years                       | Constant assumed nonnegative inflation; no country forecast      |
| Monthly savings | Remaining goal ÷ months until deadline                     | No interest or withdrawals; whole months                         |
| Debt-to-income  | Housing and debt payments ÷ gross monthly income           | Includes entered housing costs; not a lending decision           |
| Hourly pay      | Rate × paid hours per week × paid weeks per year           | Gross straight-time pay; no tax or overtime calculation          |
| Recurring costs | (Monthly charges × 12 + annual charges) × years            | Unchanged prices and renewals; no inflation                      |

Growth uses month-end contributions and whole-year horizons. Loan terms must
be at least one year. Example rates are scenarios, not recommendations.
See [Investor.gov’s compound interest tool](https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator)
and the [CFPB explanation of costs beyond principal and interest](https://www.consumerfinance.gov/archive/blog/your-mortgage-calculator-may-be-setting-you-surprise/).

Use **Search** in the header, **⌘K** on Mac, or **Ctrl+K** elsewhere to find pages,
calculators, and contact links. Type a few words, use arrow keys to select a
result, and press Enter. Escape closes search and restores focus. Search runs
locally; filter results by Pages, Tools, or Contact. Both search and mobile navigation
lock background scrolling and return you to your previous position when dismissed. Queries are neither stored nor sent to a search service. Calculator
links include a fragment (for example, `/tools/#tool-loan`) so you can bookmark
a specific tool. Financial inputs are never included in these links.

A payment that cannot reduce debt returns an explanation instead of a false
payoff date. A completed savings goal returns zero months. Invalid or incomplete
inputs replace the result with a correction message.

```mermaid
flowchart LR
  A[Choose a tool] --> B[Enter estimates]
  B --> C[Calculate locally]
  C --> D[Read result and assumptions]
  D --> E[Try another scenario]
  E --> B
```

These are original Afin implementations of common arithmetic tools, inspired by
[Calculum](https://calculum.dev/). No Calculum code or interface is embedded.
They provide educational estimates, not individualized financial advice.
JavaScript enables interactive calculation; formulas remain readable without it.

The formulas live in `src/tools/math.ts`, field definitions in `catalog.ts`, result
explanations in `results.ts`, and the React interface in `CalculatorSuite.tsx`. Unit tests cover zero values, shortfalls,
rounding, interest, and impossible payoff scenarios. Browser tests cover all
twelve tools, resets, invalid inputs, and the absence of network requests.

## Dedicated guides

Every calculator has a shareable `/tools/<name>/` page with a worked USD example,
assumptions, and a link to discuss next steps with Matt. The library links to all
twelve guides. Search outside the workspace opens these pages; within `/tools/`,
switching calculators preserves your current inputs. Existing `#tool-…` links
continue to work. Reloading or moving to another page resets inputs; financial
values are never included in a shared URL or a contact link.

The library starts with category filters and a local search box. Select a category,
search by a topic, or reset an empty result to see all twelve tools. Without
JavaScript, all calculator links remain available. The workspace below the
library retains your inputs as you switch tools.

Each guide includes an input checklist, a worked example, a scenario to try,
and answers to questions about that calculator’s assumptions. In-page links
let you move between the calculator and its supporting guidance.

Additional calculators cover a monthly contribution for a deadline, housing and debt payments as a share of gross income, straight-time hourly pay annualization, and recurring subscription costs. These are arithmetic scenarios, not lender eligibility, tax, or return estimates.
