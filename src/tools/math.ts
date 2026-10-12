export function monthlyBudget(income: number, expenses: number[]) {
  const spending = expenses.reduce((sum, amount) => sum + amount, 0);
  return { spending, remaining: income - spending };
}

export function emergencyFund(expenses: number, months: number, saved: number) {
  const target = expenses * months;
  return { target, gap: Math.max(0, target - saved) };
}

export function savingsGoal(target: number, saved: number, monthly: number) {
  const gap = Math.max(0, target - saved);
  return {
    gap,
    months: gap === 0 ? 0 : monthly > 0 ? Math.ceil(gap / monthly) : null,
  };
}

export function debtPayoff(balance: number, apr: number, payment: number) {
  if (balance === 0) return { months: 0, interest: 0, total: 0 };
  const rate = apr / 1200;
  if (payment <= balance * rate || payment <= 0) return null;
  let months = 0,
    interest = 0,
    remaining = balance;
  // Bound the simulation to 100 years and ignore floating-point residue.
  while (remaining > 0.000001 && months < 1200) {
    const charge = remaining * rate;
    interest += charge;
    remaining = Math.max(0, remaining + charge - payment);
    months++;
  }
  return remaining > 0.000001
    ? null
    : { months, interest, total: balance + interest };
}

export const netWorth = (assets: number[], debts: number[]) =>
  assets.reduce((sum, amount) => sum + amount, 0) -
  debts.reduce((sum, amount) => sum + amount, 0);

export function compoundGrowth(
  initial: number,
  monthly: number,
  rate: number,
  years: number,
) {
  let balance = initial;
  const months = Math.round(years * 12);
  for (let month = 0; month < months; month++)
    balance = balance * (1 + rate / 1200) + monthly;
  const contributed = initial + monthly * months;
  return { balance, contributed, growth: balance - contributed };
}

export function loanPayment(principal: number, rate: number, years: number) {
  const months = Math.round(years * 12);
  if (months <= 0) return null;
  const monthlyRate = rate / 1200;
  // log1p/expm1 preserve precision when the monthly rate is close to zero.
  const payment =
    monthlyRate === 0
      ? principal / months
      : (principal * monthlyRate) /
        -Math.expm1(-months * Math.log1p(monthlyRate));
  return {
    payment,
    interest: payment * months - principal,
    total: payment * months,
  };
}

export const futureCost = (cost: number, inflation: number, years: number) =>
  cost * (1 + inflation / 100) ** years;

export function monthlySavings(target: number, saved: number, months: number) {
  const gap = Math.max(0, target - saved);
  return gap === 0 ? 0 : months > 0 ? gap / months : null;
}

export const debtRatio = (income: number, housing: number, debts: number) =>
  income > 0 ? ((housing + debts) / income) * 100 : null;

export function hourlyPay(rate: number, hours: number, weeks: number) {
  const annual = rate * hours * weeks;
  return { annual, monthly: annual / 12 };
}

export function recurringCosts(monthly: number, annual: number, years: number) {
  const yearly = monthly * 12 + annual;
  return { yearly, total: yearly * years };
}

export const savingsRate = (income: number, saved: number) =>
  income > 0 ? (saved / income) * 100 : null;

export function simpleInterest(
  principal: number,
  rate: number,
  months: number,
) {
  const interest = principal * (rate / 100) * (months / 12);
  return { interest, total: principal + interest };
}

export function discountPrice(price: number, discount: number) {
  const saved = price * (discount / 100);
  return { saved, price: price - saved };
}

export const costPerUse = (price: number, upkeep: number, uses: number) =>
  uses > 0 ? (price + upkeep) / uses : null;
