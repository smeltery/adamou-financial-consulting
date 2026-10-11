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
