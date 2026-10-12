type Guide = {
  related: string[];
  icon: string;
  category: string;
  prepare: string[];
  experiment: string;
  faq: string[][];
};

export const guides: Record<string, Guide> = {
  budget: {
    related: ["emergency", "debt", "savings"],
    icon: "wallet",
    category: "Everyday money",
    prepare: [
      "Monthly take-home income after deductions.",
      "A monthly share of annual or irregular bills.",
      "Spending, debt payments, and savings you already plan for.",
    ],
    experiment:
      "Change one flexible spending category and compare the unallocated amount. Keep planned savings in the budget so they are not counted as spare money.",
    faq: [
      [
        "Does money left over count as savings?",
        "Not automatically. The result is income you have not assigned to the categories entered. You can decide whether to direct it to savings, another expense, or a different priority.",
      ],
      [
        "How do I include a yearly bill?",
        "Divide the yearly amount by 12 and include that monthly equivalent in a relevant category. Use the same one-month period for every input.",
      ],
    ],
  },
  emergency: {
    related: ["budget", "savings", "networth"],
    icon: "shield",
    category: "Everyday money",
    prepare: [
      "The essential expenses you want the buffer to cover.",
      "The number of months you want to explore.",
      "Cash savings already set aside for emergencies.",
    ],
    experiment:
      "Compare two coverage periods while keeping expenses unchanged. Look at both the target and the gap still to fund; the target is not the amount you still need to save.",
    faq: [
      [
        "Does the calculator choose how many months I need?",
        "No. You choose the coverage period. The example uses three months only to demonstrate the arithmetic; the right target depends on your circumstances.",
      ],
      [
        "What if I have already saved more than the target?",
        "The remaining gap is zero and the progress meter stops at 100%. Your entered savings are not reduced. You can explore a different coverage period without changing the saved amount.",
      ],
    ],
  },
  savings: {
    related: ["budget", "growth", "inflation"],
    icon: "target",
    category: "Future goals",
    prepare: [
      "A target amount for one specific goal.",
      "Savings already allocated to that goal.",
      "A monthly contribution you want to model.",
    ],
    experiment:
      "Try a different monthly contribution and compare the number of months. The estimate rounds up to a complete month, so a small change may not shorten the displayed timeline.",
    faq: [
      [
        "Does this include interest?",
        "No. This tool models contributions only. Use the compound growth calculator if you want to explore an assumed constant growth rate, and review its additional limitations.",
      ],
      [
        "Why is there no timeline when I enter zero?",
        "If there is still a gap and no monthly contribution, this model cannot reach the goal. If your saved amount already covers the goal, no more contributions are needed.",
      ],
    ],
  },
  debt: {
    related: ["budget", "loan", "emergency"],
    icon: "debt",
    category: "Debt & borrowing",
    prepare: [
      "The outstanding balance of one debt.",
      "Its annual percentage rate (APR).",
      "A fixed monthly payment to compare with your budget.",
    ],
    experiment:
      "Increase the monthly payment while leaving the balance and APR unchanged. Compare the estimated months and interest, then consider whether that payment fits alongside your other commitments.",
    faq: [
      [
        "Why does a payment sometimes produce no payoff estimate?",
        "The payment may not exceed the interest added each month, or the payoff may fall beyond this model’s 100-year limit. The calculator does not invent a payoff date in those cases.",
      ],
      [
        "Will this match my lender’s statement exactly?",
        "Not necessarily. This model adds interest monthly before the payment, assumes a fixed APR, and excludes new charges and fees. A lender may calculate interest daily or apply payments differently.",
      ],
    ],
  },
  networth: {
    related: ["budget", "debt", "growth"],
    icon: "balance",
    category: "Everyday money",
    prepare: [
      "Current estimates for cash, investments, and property.",
      "Outstanding loan and credit balances from the same date.",
      "A check that each asset and debt appears only once.",
    ],
    experiment:
      "Update one estimate at a time to see how it affects the total. Keep the date of your snapshot consistent; changing asset dates without updating debts can make comparisons misleading.",
    faq: [
      [
        "Should I subtract the mortgage from my property value first?",
        "Enter the property’s estimated value under assets and the outstanding mortgage under loans. Subtracting the mortgage first and then listing it as a loan would count the debt twice.",
      ],
      [
        "Does a positive net worth mean that amount is available to spend?",
        "No. Property and retirement accounts are not the same as available cash. This snapshot also excludes taxes and selling costs, so it is not an estimate of cash you could immediately access.",
      ],
    ],
  },
  growth: {
    related: ["savings", "inflation", "networth"],
    icon: "growth",
    category: "Future goals",
    prepare: [
      "A starting balance and planned monthly contribution.",
      "A hypothetical annual growth rate to explore.",
      "A whole-number time horizon in years.",
    ],
    experiment:
      "Try zero growth, then your chosen hypothetical rate, without changing contributions. This separates the effect of saving regularly from the effect of the growth assumption.",
    faq: [
      [
        "When are monthly contributions added?",
        "At the end of each month, after that month’s assumed growth. A contribution therefore begins growing the following month.",
      ],
      [
        "Is the displayed growth a prediction?",
        "No. The rate is a constant scenario you enter, not a forecast or guaranteed return. Actual returns vary and can be negative. This model excludes fees, taxes, inflation, and withdrawals.",
      ],
    ],
  },
  loan: {
    related: ["budget", "debt", "savings"],
    icon: "loan",
    category: "Debt & borrowing",
    prepare: [
      "The principal: the amount being borrowed.",
      "A fixed annual interest rate, rather than an APR that includes fees.",
      "The loan term in whole years.",
    ],
    experiment:
      "Compare two loan terms at the same principal and rate. Read the monthly payment alongside total interest; a payment on its own does not describe the total cost in this model.",
    faq: [
      [
        "What is included in the monthly payment?",
        "Only principal and interest under the fixed-rate model. Fees, insurance, property taxes, and other charges are excluded and may affect an actual payment or borrowing cost.",
      ],
      [
        "What happens at zero interest?",
        "The principal is divided by the number of monthly payments. There is no modeled interest, but fees or other real-world costs may still exist outside this calculator.",
      ],
    ],
  },
  inflation: {
    related: ["savings", "growth", "budget"],
    icon: "inflation",
    category: "Future goals",
    prepare: [
      "The cost of one expense in today’s money.",
      "A hypothetical annual inflation rate.",
      "A whole-number period in years.",
    ],
    experiment:
      "Keep today’s cost fixed and compare two rates. Longer periods make the cumulative effect more visible, even though this scenario assumes the same rate every year.",
    faq: [
      [
        "Does this use current inflation data for my country?",
        "No. You enter a hypothetical annual rate. The country selector controls currency formatting only; it does not load inflation data or convert exchange rates.",
      ],
      [
        "Can I model prices falling?",
        "This tool accepts nonnegative rates only. Zero keeps the cost unchanged. It does not model deflation or different rates in different years.",
      ],
    ],
  },
  contribution: {
    icon: "target",
    category: "Future goals",
    related: ["savings", "budget", "growth"],
    prepare: [
      "The full cost of one goal.",
      "Money already set aside for that goal.",
      "A deadline expressed in complete months.",
    ],
    experiment:
      "Give the same goal a few more months and compare the required monthly contribution. Then compare that amount with the unallocated money in your budget.",
    faq: [
      [
        "What if the goal is already covered?",
        "The remaining monthly contribution is zero. The calculator does not treat any excess savings as a new expense or require you to save them again.",
      ],
      [
        "Why does a zero-month deadline give no estimate?",
        "If money is still needed, the model needs at least one month over which to spread contributions. It cannot make a future contribution plan for a deadline of today.",
      ],
    ],
  },
  ratio: {
    icon: "balance",
    category: "Debt & borrowing",
    related: ["budget", "debt", "loan"],
    prepare: [
      "Gross monthly income before deductions.",
      "A single monthly housing payment.",
      "Other required debt payments, excluding the housing payment already entered.",
    ],
    experiment:
      "Change one monthly debt payment while keeping income unchanged. Compare the ratio, then review your full monthly budget; this percentage does not include all living costs.",
    faq: [
      [
        "Is this the ratio a lender will use?",
        "Not necessarily. Lenders can use different income definitions and payment rules. This calculator includes the housing payment and other debt payments you enter; it does not estimate approval or eligibility.",
      ],
      [
        "What if my income is zero?",
        "A ratio cannot be calculated with zero income. The tool shows no ratio rather than an infinite percentage. A ratio above 100% is possible when entered payments exceed gross income.",
      ],
    ],
  },
  pay: {
    icon: "wallet",
    category: "Everyday money",
    related: ["budget", "ratio", "contribution"],
    prepare: [
      "A straight-time hourly pay rate.",
      "The paid hours in a typical week.",
      "The number of paid weeks you expect during the year.",
    ],
    experiment:
      "Change the paid weeks to account for an unpaid break, leaving your rate and weekly hours unchanged. The monthly figure averages the annual total; individual months can still differ.",
    faq: [
      [
        "Is the result take-home pay?",
        "No. It is gross income before taxes and other deductions. This calculator does not apply tax rules for your country or estimate benefits.",
      ],
      [
        "Does it include overtime?",
        "No. Every hour uses the same rate. Overtime premiums, bonuses, tips, and variable schedules are outside this simple model.",
      ],
    ],
  },
  recurring: {
    icon: "switch",
    category: "Everyday money",
    related: ["budget", "contribution", "inflation"],
    prepare: [
      "The total of your monthly recurring charges.",
      "Separately, the total of charges billed once a year.",
      "The number of complete years you want to compare.",
    ],
    experiment:
      "Remove one unused monthly subscription from the combined monthly amount. Compare the period total before and after, keeping the time horizon unchanged.",
    faq: [
      [
        "Should I convert annual subscriptions to monthly amounts first?",
        "No. Put monthly charges in the monthly field and yearly charges in the annual field. The calculator combines them, so entering the same charge in both fields would double count it.",
      ],
      [
        "Does the result assume prices rise?",
        "No. Prices and subscriptions stay unchanged throughout the selected period. Use the inflation tool separately to explore a hypothetical rising cost.",
      ],
    ],
  },
};
