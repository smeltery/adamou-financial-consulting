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
