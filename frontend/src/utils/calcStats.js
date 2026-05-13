export const calculateStats = (expenses) => {
  const now = new Date();

  const thisMonthExpenses = expenses.filter((exp) => {
    const date = new Date(exp.expense_date);
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  });

  if (thisMonthExpenses.length === 0) {
    return { total: 0, count: 0, average: 0 };
  }

  const total = thisMonthExpenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0,
  );
  const count = thisMonthExpenses.length;
  const average = total / count;

  return { total, count, average };
};
